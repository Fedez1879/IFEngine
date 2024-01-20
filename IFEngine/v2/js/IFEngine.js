class IFEngine{
	// Questa classe deve essere estesa
	constructor(){
		// Lo schermo
		this.CRT = new CRT();
		
		this.Parser = new Parser()
		// Lo storage
		this.storage = window.localStorage;
		
		this.Sound = new Sound();

		// Costante da modificare, è la chiave di salvataggio
		// nel localstorage
		this.SAVED = i18n.IFEngine.SAVEDPrefix;

		this.defaultInput = "\n>";

		// DAltri dati da salvare
		this.otherData = {
			points: null,
			maxPoints: null,
			moves: 0
		};

		// Elenco degli eventi "a tempo"
		this.timedEvents = {};
		this.activeTimedEvents = [];

		// Sequenze
		this.sequences = {}

		// Stanzza iniziale
		this.startingRoom = AD.rooms[0]

		// Menu
		this.menu = {
			main: {
				label: i18n.IFEngine.menu.choose,
				options: {
					1: {
						label: i18n.IFEngine.menu.new,
						callback: async () => {
							await this.CRT.clear();
							this.restart();
						}
					},
					2: {
						label: i18n.IFEngine.menu.load,
						callback: async () => {
							return await this.restore();
						}
					},
					3: {
						label: i18n.IFEngine.menu.readInstructions,
						callback: async () => {
							await this.instructions();
							await this.CRT.clear();
							await this.run();
						}
					},
					4: {
						label: i18n.IFEngine.menu.quit,
						callback: () => {
							this.byebye();
						}
					}
				}
			},
			contextual: {
				label: i18n.IFEngine.menu.choose,
				options: {
					1: {
						label: i18n.IFEngine.menu.restart,
						callback: async () => {
							this.restart(false);
						}
					},
					2: {
						label: i18n.IFEngine.menu.load,
						callback: async () => {
							return await this.restore();
						}
					},
					3: {
						label: i18n.IFEngine.menu.stop,
						callback: () => {
							this.byebye();
						}
					}
				}
			}
		}
		
		this.Thesaurus = new Thesaurus(this);
		return this;

	}

	_checkStorage(){
		return typeof this.storage !== 'undefined';
	}
	
	// Inizia l'avventura
	start(){
		//Il parser delle azioni
		this.Parser = new Parser(this.Thesaurus.verbs, this.Thesaurus.commands);
		

		if(AD === undefined){
			throw i18n.IFEngine.warnings.notLoaded;
		}

		let datiIniziali = this._getTbs();

		this.datiIniziali = JSON.stringify(datiIniziali, (k,v) => typeof v === 'function' ? "" + v : v);
		// Si parte!
		this.run();
	}

	async restart(prologue) {
		if(prologue === undefined) 
			prologue = true;
		await this.CRT.clear();
		
		if(this.datiIniziali != undefined)
			this.reload(this.datiIniziali);
		//this.adventureData.prologue = prologue;
		this.enterRoom(this.startingRoom);
	}

	// Mostra il menù
	async run(){
		this.displayMenu(this.menu.main);
	}
	
	// Mostra un menu
	async displayMenu(aMenu){
		let menu = { ...aMenu }
		await this.CRT.printTyping(menu.label+"\n");
		let res = await this.multipleChoiche(menu.options)
		if(res == false)
			this.displayMenu(aMenu);
	}

	async multipleChoiche(options){
		for(let o in options){
			if(options[o].displayIf ===undefined || options[o].displayIf)
				await this.CRT.printTyping(o+") "+options[o].label);
			else 
				delete options[o];
		}
		
		await this.CRT.println();
		return await this.choose(options, undefined, true);
	}
	// si o no
	async yesNoQuestion(question, cr){
		let options = {}
		options[i18n.IFEngine.yesOrNo.yes] = () => true;
		options[i18n.IFEngine.yesOrNo.yes.substring(0,1)] = () => true;
		options[i18n.IFEngine.yesOrNo.no] = () => false;
		options[i18n.IFEngine.yesOrNo.no.substring(0,1)] = () => false;
		
		return await this.choose(
			options,
			question == undefined ? i18n.IFEngine.questions.areYouSureQuestion : question,
			cr)
		;
	}

	// Parsing delle scelte
	async choose(options, question, cr){
		let optionsList = "("+Object.keys(options).join(",")+") ";
		
		if(question === undefined)
			question = "";
		
		let choose;

		do {
			choose = await this.ask(question);
			
			if(options[choose] === undefined){
				question = optionsList;
			}
		} while (options[choose] === undefined);

		let callback = typeof options[choose] === 'function' ? 
			options[choose] :
			options[choose].callback;

		if(cr) this.CRT.println()
			
		let result = await callback();
	
		this.CRT.currentCol = 1;
		
		return result;
	}
	
	async ask(question, noQuestionMark){
		await this.CRT.printTyping(question+(noQuestionMark ? "" : i18n.IFEngine.questionMark)+" ",{cr:false});
		return await this.CRT.input(false);
	}
	// Esci dal gioco
	async byebye(){
		await this.CRT.printTyping(i18n.IFEngine.messages.tanksForPlaying, {nlAfter:1,nlBefore:1});
		await this.CRT.wait();
		await this.CRT.clear();
		window.close();
	}
	
	
	
	// Entra nella stanza
	async enterRoom(room, ignoreTimedEvents){
		if(await this._breakRoomAction("onExit"))
			return;

		AD.currentRoom = room;

		if(AD.currentRoom.interactors === undefined)
			AD.currentRoom.interactors = {};
		
		if(AD.currentRoom.firstEnter === undefined)
			AD.currentRoom.firstEnter = true 
		else
			AD.currentRoom.firstEnter = false

		//this.Parser.setOverride(AD.currentRoom.override);

		if(await this._breakRoomAction("onEnter"))
			return;

		await this.printRoomLabel();
		await this.gameLoop(true, ignoreTimedEvents);
	}

	async printRoomLabel(){
		if(AD.currentRoom.label !== undefined && !AD.currentRoom.dark){
			await this.CRT.println("<strong style='text-decoration:underline'>"+AD.currentRoom.label+"</strong>");
		}
	}
		
	// CONTROLLE CHE UN'AZIONE DI INGRESSO O USCITA NON SIA "definitiva...."
	async _breakRoomAction(action){
		if(AD.currentRoom && AD.currentRoom[action]){
			let ret = await AD.currentRoom[action]();
			return ret === false;
		}
	}

	/*
	// Aggiorna gli oggetti nella stanza in base alla loro posizione
	refreshRoomObjects(){
		AD.currentRoom.objects = this._filter(o => {
			return o.location == AD.currentRoom.key;
		}, this.adventureData.objects);
		//console.log(AD.currentRoom.objects);
	}
	*/
	// Descrive la stanza corrente
	async currentRoomDescription(longDescription){
		if(AD.currentRoom.dark){

			await this.CRT.printTyping(AD.currentRoom.darkDescription ? this._cos(AD.currentRoom.darkDescription) : this.Thesaurus.defaultMessages.TOO_DARK_HERE);
			return;
		}
		let description = longDescription ? 
			AD.currentRoom.description : 
			( 
				AD.currentRoom.shortDescription ? 
				AD.currentRoom.shortDescription :
				AD.currentRoom.description
			)
		
		description = this._cos(description);
		description += this.addInitialDescription(AD.currentRoom.interactors);
		description += this.addInitialDescription(AD.currentRoom.objects);
		
		await this.CRT.printTyping(description);
		await this.listVisibleThings(AD.currentRoom.interactors);
		await this.listVisibleThings(AD.currentRoom.objects);
	}

	addInitialDescription(lista){
		if(lista == null || Object.keys(lista).length == 0) return "";
		let more = [];
		for(let i in lista){
			if(lista[i].visible == undefined && lista[i].initialDescription){
				//console.log(typeof lista[i].initialDescription)	
				let initialDescription = this._cos(lista[i].initialDescription);
				more.push(initialDescription);
			} 

		}
		return more.length == 0 ? "" : "\n"+more.join("\n\n");
	}	

	
	// Elenca una lista "cose" visibili
	async listVisibleThings(list){
		if (list == null)
			return;
		if( Object.keys(list).length > 0){
			for(let i in list){
				if(list[i].visible){
					//console.log(list[i]);
					let whatISee = Array.isArray(list[i].label) ? 
						list[i].label[list[i].status] : 
						list[i].label;
					await this.CRT.printTyping(i18n.IFEngine.ISee+" "+whatISee.trim()+".");
				}
			}
		}
	}

	
	// Avvia un evento a tempo
	startTimedEvent(eventLabel){
		if(this.activeTimedEvents.indexOf(eventLabel) < 0)
			this.activeTimedEvents.push(eventLabel);
	}

	// Ferma un evento a tempo.
	// Eventualmente resetta l'indice del currentStep
	stopTimedEvent(eventLabel, resetIndex){
		if(resetIndex === undefined)
			resetIndex = true;
		
		let timedEvent = this.timedEvents[eventLabel];
		
		if(timedEvent !== undefined){
			if(resetIndex)
				timedEvent.currentStep = timedEvent.start;
			this.activeTimedEvents = this.activeTimedEvents.filter(e => e != eventLabel);
		}
	}
	
	// Il loop del gioco
	async gameLoop(describeCurrentRoom, ignoreTimedEvents){
		
		if(describeCurrentRoom){
			await this.currentRoomDescription(AD.currentRoom.firstEnter);
		}

		// Esistono eventi a tempo attivi?
		if(this.activeTimedEvents.length > 0 && !ignoreTimedEvents){
			for(let i in this.activeTimedEvents){
				let timedEvent = this.timedEvents[this.activeTimedEvents[i]];
				if(timedEvent !== undefined){
					var limit = 0;
					
					// Se non ho definito currentStep, lo definisco ora
					// con valore uguale a start;
					if(timedEvent.currentStep === undefined)
						timedEvent.currentStep = timedEvent.start;
					
					// ho raggiunto il limite ?
					if(timedEvent.currentStep <= limit){
						this.stopTimedEvent(this.activeTimedEvents[i]);
						let goOn = await timedEvent.onLimit();
						if(goOn)
							break;
						return;
					}
					

					// Eseguo se esiste lo step i-esimo
					if(timedEvent.steps && timedEvent.steps[timedEvent.currentStep] !== undefined)
						await timedEvent.steps[timedEvent.currentStep]();

					timedEvent.currentStep--;
				}
			}
			

		}

		this.input();
	}

	async input(){
		// Attendo il comando
		await this.CRT.print(this.defaultInput);
		let input = await this.CRT.input();
		this.otherData.moves++
		input = this._prepare(input);
		// Faccio il parsing del comando. 
		// Se la funzione mi restituisce undefined o true allora ciclo nuovament il loop
		let repeat = await this._parse(input);

		if(repeat === undefined || repeat == true){
			this.gameLoop();
		}
	}

	// Salva il gioco
	async save() {
		if(this._checkStorage() == false ){
			await this.CRT.printTyping(i18n.IFEngine.warnings.localstorageInactive);
			return;
		} 
		let saveLabel;
		do{
			await this.CRT.printTyping(i18n.IFEngine.questions.saveLabel+" ",this.CRT.printDelay,false);
		
			saveLabel = await this.CRT.input(false);
			saveLabel = saveLabel.trim();
			if(saveLabel == i18n.IFEngine.questions.listLetter.toLowerCase()){
				await this.CRT.printTyping(i18n.IFEngine.warnings.labelNotValid+"\n",this.CRT.printDelay);
			}

			if(saveLabel == i18n.IFEngine.questions.cancelLetter.toLowerCase()){
				return true;
			}
		} while (saveLabel.length == 0 || saveLabel == i18n.IFEngine.questions.listLetter.toLowerCase())
		
		let tbs = this._getTbs();
		this.storage.setItem(this.SAVED+"-"+saveLabel, JSON.stringify(tbs, function(key, value) {
		  if (typeof value === "function") {
		    return "/Function(" + value.toString() + ")/";
		  }
		  return value;
		}));
		await this.CRT.printTyping(i18n.IFEngine.messages.saved);
		this.gameLoop(false,true)
		return false;
	}

	// Ritorna i dati principali da salvare
	_getTbs(){
		return {
			...AD,
			...{ 
				otherData: this.otherData
			}
		};
	}

	// Carica il gioco
	async restore() {
		if(this._checkStorage() == false ){
			await this.CRT.printTyping(i18n.IFEngine.warnings.localstorageMustBeActivated);
			return
		} 
		let loadLabel;

		do{
			await this.CRT.printTyping(i18n.IFEngine.questions.restoreLabel);
		
			loadLabel = await this.CRT.input(false);
			loadLabel = loadLabel.trim();

			if(loadLabel == i18n.IFEngine.questions.cancelLetter.toLowerCase()){
				return false;
			}

			if(loadLabel == i18n.IFEngine.questions.listLetter.toLowerCase()){
				let sdk = Object.keys(this.storage).filter(key => key.startsWith(this.SAVED+"-"));

				let savedGames = Object.keys(this.storage)
					.sort()
						.filter(key => sdk.includes(key))
						.reduce((obj, key) => {
							return {
								...obj,
								[key]: this.storage[key]
							};
						}, {});
				  
				

				if(Object.keys(savedGames).length == 0){
					await this.CRT.printTyping(i18n.IFEngine.warnings.noData);
					await this.CRT.sleep(1000);
					return;	
				}


				for(let key in savedGames){
					await this.CRT.printTyping("- "+key.substring(this.SAVED.length+1).toUpperCase());
				}

				this.CRT.println("");

			}

		} while ( loadLabel.length == 0 || loadLabel == i18n.IFEngine.questions.cancelLetter.toLowerCase() || loadLabel == i18n.IFEngine.questions.listLetter.toLowerCase())
		
		let realLabel = this.SAVED+"-"+loadLabel;
		if(this.storage[realLabel] === undefined){
			await this.CRT.printTyping(i18n.IFEngine.warnings.notFound(loadLabel.toUpperCase())+"\n");
			return this.restore();	
		}
		
		let stored = this.storage.getItem(realLabel);
		if(stored == null) {
			await this.CRT.printTyping(i18n.IFEngine.warnings.noData+"\n");
			return this.restore();	
		}

		AD = await this.reload(stored);

		await this.CRT.printTyping(i18n.IFEngine.messages.loaded+"\n");
		await this.CRT.sleep(1000);
		this.CRT.clear()
		this.enterRoom(AD.currentRoom, true);
		return true;
	}
	
	reload (stored){
		let tbr = JSON.parse(stored, function(key, value) {
		  if (typeof value === "string" &&
		      value.startsWith("/Function(") &&
		      value.endsWith(")/")) {
		    value = value.substring(10, value.length - 2);
		    return (0, eval)("(" + value + ")");
		  }
		  return value;
		});

		if(tbr.currentRoom === undefined)
			tbr.currentRoom = this.startingRoom;
		/*
		for (let k in tbr)
			this[k] = Array.isArray(tbr[k]) ? [ ...tbr[k] ] : { ...tbr[k] };
		*/
	
		return tbr;
	}

	async instructions(){
		await this.CRT.printTyping(i18n.IFEngine.messages.noInstructions+"\n");
		await this.CRT.wait();
	}
	
	// Morte
	async die(){
		await this.CRT.printTyping(i18n.IFEngine.messages.death);
		this.displayMenu(this.menu.contextual);
		return false;
	}

	// Scopri oggetto, quindi diventa visibile
	discover(object, justRemove, propagate){
		if(justRemove)
			delete object.visible
		else{
			object.visible = true
			delete object.initialDescription
		}
		if(propagate && object.linkedObjects){
			for (let lo_key of object.linkedObjects){
				let otd = this._get(lo_key,this.adventureData.objects)
				if(otd)
					this.discover(otd, justRemove, propagate)
			}
		}
		return null		
	}

	linkObjects(object, key_list){
		if(object.linkedObjects === undefined)
			object.linkedObjects = [];
		for (let obj_key of key_list){
			if(object.linkedObjects.indexOf(obj_key) == -1)
				object.linkedObjects.push(obj_key)
		}
	}

	unlinkObjects(object, key_list){
		if(Array.isArray(object.linkedObjects) == false)
			return
		for (let obj_key of key_list){
			let index = object.linkedObjects.indexOf(obj_key)
			if(index >= 0)
				object.linkedObjects.splice(index,1)
		}
	}

	// Abilita direzione in una stanza
	enableDirection(direction, room){
		if(room === undefined) room = AD.currentRoom;
		delete room.blockedDirections[room.blockedDirections.indexOf(direction)];
	}

	// Disabilita direzione in una stanza
	disableDirection(direction, room){
		if(room === undefined) room = AD.currentRoom;
		if(room.blockedDirections === undefined)
			room.blockedDirections = [];
		if(room.blockedDirections.indexOf(direction) < 0)
			room.blockedDirections.push(direction);
	}

	// Esegui una sequenza di azioni
	async runSequence(labelSequenza, args){
		let sequence = this.sequences[labelSequenza];
		return await sequence(args);
	}
	
	// Controlla se il giocatore ha un oggetto nell'inventario
	playerHas(object){
		return AD.inventory.indexOf(object) >= 0;
	}

	wear(o, defaultMessage){
		if(o.worn)
			return i18n.IFEngine.messages.alreadyDone
		o.worn = true;
		return defaultMessage === undefined ? 
			this.Thesaurus.defaultMessages.DONE :
			defaultMessage
	}

	takeOff(o, defaultMessage){
		if(o.worn == false)
			return i18n.IFEngine.messages.alreadyDone
		o.worn = false;
		return defaultMessage === undefined ? 
			this.Thesaurus.defaultMessages.DONE :
			defaultMessage
	}

	// Stampa i punti del gioco
	async _points(){
		if (this.dataPoints === undefined)
			await this.CRT.printTyping(i18n.IFEngine.messages.noPoints);
		else{
			await this.CRT.printTyping(i18n.IFEngine.messages.points(this.otherData));
		}
		return this.noIncrement()
	}

	// Stampa il numero di mosse eseguite
	async _moves(){
		this.otherData.moves--;
		await this.CRT.printTyping(i18n.IFEngine.messages.moves(this.otherData.moves));
		return this.noIncrement(true)
	}

	noIncrement(already){
		if (!already)
			this.otherData.moves--;
		this.gameLoop(false, true)
		return false;
	}

	// AggiungePunti
	async addPoints(action){
		if (this.dataPoints === undefined)
			return 0;
		let actionPoints = this.dataPoints.actionPoints;
		if(this.otherData.playedActionPoints == undefined)
			this.otherData.playedActionPoints = [];
		if(this.otherData.playedActionPoints.indexOf(action) == -1){
			this.otherData.playedActionPoints.push(action)
			this.otherData.points += actionPoints[action].i;
		}
	}

	async wtf(APO, wtf){
		/*if(wtf.indexOf(" ") >=0)
			wtf = wtf.substring(0,wtf.indexOf(" ")); */
		await this.CRT.printTyping(i18n.IFEngine.messages.notHere);
		return true;
	}

	async inputNotUnderstood(){
		this.otherData.moves--;
		await this.CRT.printTyping(this.Thesaurus.defaultMessages.DONT_UNDERSTAND);
		this.gameLoop(false,true)
		return false;
	}

	// Parsing del comando
	async _parse(input){
		// Approfondiamo
		let APO = this.Parser.parse(input);
		
		if(APO === false){
			return this.inputNotUnderstood(input);
		}
		
		if(typeof APO == 'string'){
			// comando = verbo, manca il resto
			await this.CRT.printTyping(APO.charAt(0).toUpperCase() + APO.slice(1)+" "+i18n.IFEngine.questions.what+" "+this.Thesaurus.defaultMessages.BE_MORE_SPECIFIC);
			return true;
		}
		
		// è un comando imperativo con callback
		if(APO.command){
			if(APO.actionObject.movement) return await this._go(APO.actionObject.direction, APO.actionObject.defaultMessage);
		
			let action = `on_${APO.verb}`;
			if(AD.currentRoom.hasOwnProperty(action)){
				let ret = typeof AD.currentRoom[action] == 'string' ? AD.currentRoom[action]: AD.currentRoom[action]();
				if (typeof ret == 'string'){
					await this.CRT.printTyping(ret)
					return true
				}
				return ret;
			}
			

			let callback = APO.actionObject.callback ? APO.actionObject.callback : APO.actionObject.defaultMessage;
			if(callback){
				let ret = await this._callbackOrString(callback, input);
				if(ret !== null)
					return ret;
			}
		}

		// Azione riconosciuta, ovvero promessa
		return await this._action(APO, input);
	}

	async _action(APO, input){
		let actionObject = APO.actionObject;
		
		// è un'azione!
		// vediamo se è fattibile
		
		let testVerb = APO.subjects[0];
		if(testVerb !== undefined){
			if(testVerb.indexOf(" ") >=0)
				testVerb = testVerb.substring(0,testVerb.indexOf(" "));	
			if(typeof this.Parser.parse(testVerb) == 'string'){
				return await this.inputNotUnderstood();
			} 
		}
		
		// Roba scenica
		if(AD.currentRoom.scenic){

			for(let pattern of AD.currentRoom.scenic.pattern){
				pattern = new RegExp("^"+pattern+"$", 'i');
				if(testVerb.match(pattern)){
					return await this.CRT.printTyping(AD.currentRoom.scenic.defaultMessage ? AD.currentRoom.scenic.defaultMessage : APO.actionObject.defaultMessage)
				}
			}
		}

		// Mappo i complementi con 
		// - interattori della stanza
		// - oggetti nella stanza
		// - oggetti nell'inventario
		let mSubjects = APO.subjects.map(subject => {
			let interactor = this._get(subject,AD.currentRoom.interactors);
			let roomObject = this._get(subject, AD.currentRoom.objects);
			let inventoryObject = this._get(subject, AD.inventory);

			return interactor ? interactor : 
				(roomObject ? roomObject : 
				(inventoryObject ? inventoryObject : null));
		}); 

		//mSubjects = mSubjects.filter( i => {return i != null});

		// non sono riuscito a mappare tutto
		if(APO.subjects.length != mSubjects.filter(i=>{return i!=null}).length){
			// Recupero l'indice dell'oggetto
			let nullIndex = mSubjects.indexOf(null);
			let wtf = this.Thesaurus.verbs[APO.verb] === undefined ? input : APO.subjects[nullIndex];
			return await this.wtf(APO, wtf);
		}

		//console.log(mSubjects)

		if(AD.currentRoom.dark){
			await this.CRT.printTyping(this.Thesaurus.defaultMessages.TOO_DARK_HERE);
			return
		}

		// Ho scritto solo il verbo
		if(APO.subjects.length == 0 && (actionObject.singolo === true)){
			/*
			// Se è un verbo che necessita di un complemento
			// Sii più preciso!
			if(actionObject.singolo === undefined || actionObject.singolo == false){
				await this.CRT.printTyping(this.Thesaurus.defaultMessages.SII_PIU_SPECIFICO);
				return true;
			} 
			*/
		
			// Ok, si può usare da solo.
			if(actionObject.callback){
				let ret = this._callbackOrString(actionObject.callback);
				if(ret !== null)
					return ret;
			}
			// Scrivi il messaggio di default se c'è altrimenti messaggio generico
			await this.CRT.printTyping(actionObject.defaultMessage === undefined ? this.Thesaurus.defaultMessages.PREFER_NOT : actionObject.defaultMessage);
			return true;
			
		}


		// è definito un override con callback
		if(actionObject.callback !== undefined){

			let ret = await this._callbackOrString(actionObject.callback,mSubjects);
			if(ret !== null)
				return ret;
		}

		let visibile = mSubjects[0].visible === undefined ? true : mSubjects[0].visible;

		if(visibile || APO.verb == "search"){
			// Eseguji l'azione sugli oggetti/interattori mappati
			let actionResult = await this._playAction(APO, mSubjects);
			
			// null: azione non definita a livello di oggetto
			// true: cicla di nuovo il gameloop
			// false: ci sarà un redirect nell'azione stessa, quini non ciclare il gameloop
			if(actionResult != null)
				return actionResult;
		}
		
		if(visibile == false && actionObject.inventory == undefined && APO.verb != "search"){
			return this._notSeen(mSubjects[0]);
		}
		if(actionObject.inventory){
			if(Array.isArray(actionObject.inventory)){

			} else {
				if (!this.playerHas(mSubjects[0]))
					return await this.CRT.printTyping(this.Thesaurus.defaultMessages.DONT_HAVE_ANY);
			}
		}
		switch (APO.verb){
			case "lookAt":

				let descrizione = mSubjects[0].description ?  
					(Array.isArray(mSubjects[0].description) ? mSubjects[0].description[mSubjects[0].stato] : this._cos(mSubjects[0].description)) :
					actionObject.defaultMessage;
				return await this.CRT.printTyping(descrizione);
			
			case "take":
				let ret = await this._take(mSubjects[0]);
				return ret === undefined ? true : ret;
			
			case "drop":
	 			if(AD.inventory.indexOf(mSubjects[0]) >= 0){
					this._removeFromInventory(mSubjects[0]);
					return await this.CRT.printTyping(this.Thesaurus.defaultMessages.DONE);
				}

				return await this.CRT.printTyping(this.Thesaurus.defaultMessages.DONT_HAVE_ANY);
		}



		// non posso applicarlo al soggetto/ai soggetti
		let errorMessage = 
				actionObject.defaultMessage === undefined ? 
				this.Thesaurus.defaultMessages.DONT_UNDERSTAND : 
				actionObject.defaultMessage
			;
		
		await this.CRT.printTyping(errorMessage);
		
		return (errorMessage == this.Thesaurus.defaultMessages.DONT_UNDERSTAND) ? undefined : true;
				

	}

	async _notSeen(s){
		await this.CRT.printTyping(this.Thesaurus.defaultMessages.NOT_SEEN_HERE);
		return true;
	}

	// Esegui l'azione richiesta
	async _playAction(APO, s){
		
		//console.log(APO,s)
		let verb = APO.verb;
		
		s = [...s];

		let ai = await this._inventoryAction(APO,s);
		if(ai)
			return true;

		if(s[0] !== undefined){
			/*
			let play = this.Parser._getSource("on_"+verb, s[0]);
			if(play)
				return await this._callbackOrString(play, s);
			*/
			let action = `on_${verb}`;
			if(s[0].hasOwnProperty(action)){
				let ret = typeof s[0][action] == 'string' ? s[0][action] : s[0][action](s);
				if (typeof ret == 'string'){
					await this.CRT.printTyping(ret)
					return true
				}
				return ret;
			}
			
		}
				
		return null;
	}

	async _callbackOrString(source, arg){
		if(typeof source == 'string'){
			await this.CRT.printTyping(source);
			return true;
		}
		
		let ret = await source(arg);

		if(typeof ret == 'string'){
			await this.CRT.printTyping(ret);
			return true;
		}

		if(ret === undefined)
			ret = true;

		// console.log(ret);
		return ret;
	}

	stringOrFalse(callback){
		return typeof callback == 'string' ? callback: false;
	}

	async _inventoryAction(APO,s){
		if(APO.actionObject.inventory){
			/*
			let inventoryKey = typeof APO.actionObject.inventory == 'boolean' ? [APO.actionObject.inventory] : APO.actionObject.inventory;
			*/
			for(let i in s){
				if (AD.inventory.indexOf(s[i]) == -1){
					await this.CRT.println(this.Thesaurus.defaultMessages.DONT_HAVE_ANY);
					return true;
				} 
				/*
				if(inventoryKey[i] && /*s[i].type == "oggetto"*//* && this.inventory[s[i].key] === undefined){
					await this.CRT.println(this.Thesaurus.defaultMessages.DONT_HAVE_ANY);
					return true;
				}
				*/
			}
			
		}
	}

	// Movimento
	async _go(direction, defaultMessage){

		if(AD.currentRoom[direction]){
			let ret = AD.currentRoom[direction]();
			if(typeof ret == 'string'){
				await this.CRT.printTyping(ret);
				return true;
				
			}
			this.enterRoom(ret);
			return false;
		}

		/*

		let blockedDirections = AD.currentRoom.blockedDirections === undefined ? [] : AD.currentRoom.blockedDirections; 
		
		//Esiste la direzione
		//console.log(direction,directions)
		if(directions[direction] !== undefined && blockedDirections.includes(direction) === false){
			if(typeof directions[direction] == 'string'){
				this.enterRoom(directions[direction]);
				return false;
			}
			let ret = await directions[direction]();
			if(typeof ret == 'string'){
				await this.CRT.printTyping(ret);
				return true;
			}
			return ret === undefined ? false : ret;
		}
		*/
	
		// No way, non si può andare di là
		await this.CRT.printTyping(defaultMessage);
		return;
	}

	// Mostra l'inventario
	async _inventory(action){
		let output;
		if(AD.inventory.length == 0){
			output = i18n.IFEngine.messages.noObjects
		} else {
			output = i18n.IFEngine.messages.carriedObjectsLabel
			for(let i of AD.inventory){
				let label = Array.isArray(i.label) ? 
					i.label[i.status] : 
					i.label
				;
				output += "\n- "+label.trim()+".";
			}
		}
		await this.CRT.printTyping(output);
	}

	// Aggiungi oggetto nell'inventario
	_addInInventory(object){
		this.discover(object);
		AD.currentRoom.objects.splice(AD.currentRoom.objects.indexOf(object),1)
		AD.inventory.push(object);
	}

	// Rimuovi oggetto dall'inventario
	_removeFromInventory(object, destination){
		if(destination === undefined){
			if(AD.currentRoom.objects === undefined)
				AD.currentRoom.objects = []
			destination = AD.currentRoom.objects
		}
		
		AD.inventory.splice(AD.inventory.indexOf(object),1)
		
		destination.push(object)
	}

	// Prendi 
	async _take(object){
		console.log(object)
		if(AD.currentRoom.objects.indexOf(object) >= 0){
			this._addInInventory(object);
			await this.CRT.printTyping(this.Thesaurus.defaultMessages.DONE);
		} else if(AD.inventory.indexOf(object) >= 0){
			await this.CRT.printTyping(i18n.IFEngine.messages.alreadyHaveIt);
		} else
			await this.CRT.printTyping(this.Thesaurus.verbs.take.defaultMessage);
	}

	_prepare(input){
		input = input.trim().toLowerCase()
		// tolgo gli accenti alle parole
		input = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		
		for (let step of i18n.IFEngine.prepareInputSteps){
			let pattern = RegExp(step.pattern,"g");
			input = input.replace(pattern,step.replaceWith);
		}
		
		//console.log(input)
		return input;
		/*
		input = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		return input;
		*/
	}

	_cos(what){
		return typeof what == "string" ? what : (what)()
	}

	// Filtra JSON
	_filter(callback, jsonObj){
		let filtered = {}
		for (let k in jsonObj){
			if(callback(jsonObj[k]) == false)
				continue;
			filtered[k] = jsonObj[k];
		}

		return filtered;
	}

	// Recuprea Oggetto da JSON in base al pattern
	// definito nell'oggetto stesso (se definito)
	// altrimenti ritorna false
	_get(needle, jsonObjList){

		for (let k in jsonObjList){
			
			let jsonObj = jsonObjList[k];

			let res = this._match(needle, jsonObj);
			
			if(!res) {
				if(jsonObj.linkedObjects){
					for(let linked of jsonObj.linkedObjects){
						console.log(linked)
						
						if(linked && this._match(needle, linked))
							return linked;
					}
				}
				continue;
			} else {
				jsonObj.key = k;
				return jsonObj;

			}
		
		}
		
		return false;
	}

	_match(needle, obj){
		let pattern;

		// Se non è definito il patten ma il label si
		// provo a ricostruire il pattern dalla label
		if(obj.pattern === undefined) {
			if(obj.label === undefined)
				return false;

			pattern = this._simplePattern(obj.label);
		}
		else
			pattern = obj.pattern;
	
		
		let regExp = new RegExp("^(?:"+pattern+")","i");
		let res = needle.match(regExp);
		return res;
	}

	_simplePattern(string){
		let chunks = string.split(/\s+/);
		chunks[0] = "("+chunks[0]+"\\s+)?";
		
		return chunks[0]+chunks.slice(1).join("\\s+")
	}


}