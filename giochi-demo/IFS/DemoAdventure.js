class DemoAdventure extends IFEngine{
	
	constructor(){
		super();
		
		document.title = i18n.htmlTitle;

		this.CRT.defaultCR = `\n`;
		this.defaultInput = `\n] `
		this.startingRoom = R.ufficio;

		this.Thesaurus = new DemoThesaurus(this)

		//this.CRT.sleep = (ms) => true; // for speed test

		this.commonInteractors = {
			wall: {
				pattern: this.Thesaurus.commonPatterns.wall
			},
			floor: {
				pattern: this.Thesaurus.commonPatterns.floor
			},
			ceiling: {
				pattern: this.Thesaurus.commonPatterns.ceiling
			},
			exit:{
				pattern: this.Thesaurus.commonPatterns.exit
			},
			outside: {
				pattern: this.Thesaurus.commonPatterns.outside
			}

		}

		this.sequences = {
			titolo: async () => {
				this.CRT.clear();
				await this.CRT.println(i18n.title, {nlAfter: 1, waitBefore: 1000});
				await this.CRT.wait();
				this.CRT.clear();
				
			},
			prologo: async () => {
				await this.CRT.printTyping(`Accidenti che mal di testa....`, {waitBefore: 1000})
				await this.CRT.printTyping(`Come ho fatto ad addormentarmi in ufficio?`, {waitBefore: 1500})
				await this.CRT.printTyping(`E quanto tempo è passato?`, {waitBefore:1000})
				await this.CRT.printTyping(`Uhm... `, {cr: false, waitBefore: 1500})
				await this.CRT.printTyping(`E' tutto troppo silenzioso qui.`, {waitBefore: 2000});
				await this.CRT.printTyping(`Sarà meglio tornare a casa.`, {nlAfter: 1,waitBefore: 1500,waitAfter: 2000})
			},
			crollo: async () => {
				await this.CRT.printTyping(`Appena esci dall'ufficio la porta dietro di te si richiude pesantamente!`, {waitAfter: 1500})
				await this.CRT.printTyping(`Non vedi l'ora di tornare a casa. Il tuo ufficio è così claustrofobico... per fortuna adesso sei fuori da quella stanza opprimente.`, {waitAfter: 2000})
				await this.CRT.printTyping(`Percorri con passo svelto il corridoio fino in fondo, quindi inizi a scendere le scale che ti portano al piano terra. All'inizio procedi con cautela, poi sempre più rapidamente...`, {waitAfter: 2500})
				await this.CRT.printTyping(`Finalmente arrivi in fondo alle scale!`,{cr: false,waitAfter: 1500})
				await this.CRT.printTyping(` Improvvisamente però... `,{printDelay: 75, cr:false, waitAfter: 1500});
				await this.CRT.printTyping(`BOOM!`, {waitAfter: 2000})
				await this.CRT.printTyping(`Prima senti un'esplosione...`,{printDelay: 75, cr:false, waitAfter: 1000})
				await this.CRT.printTyping(` poi la terra inizia a tremare fortissimo!`, {printDelay: 75, waitAfter: 2000})
				await this.CRT.printTyping(`Cerchi riparo mentre le scale dietro di te crollano...`,{nlAfter: 1, waitAfter: 3000})
				if(this.adventureData.timedEvents.earthquake.currentStep > 6)
					this.adventureData.timedEvents.earthquake.currentStep = 6
			},
			finale: async() => {
				await this.CRT.printTyping(`Dopo aver aperto il portone quel poco che basta per farti uscire, corri come un forsennato verso il parcheggio.`, {waitAfter: 4000})
				await this.CRT.printTyping(`Una tremenda scossa di terremoto di durata interminabile fa crollare l'edificio. Cadi a terra dalla violenza, ma essendo fuori all'aperto non hai conseguenze gravi.`, {waitAfter: 5000})
				await this.CRT.printTyping(`Appena la scossa si attenua, riesci finalmente ad alzarti...`, {waitAfter: 2000, cr:false})
				await this.CRT.printTyping(`Non credi ai tuoi occhi...`, {waitAfter: 1500})
				await this.CRT.wait();
				await this.CRT.printTyping(`Osservi sbalordito la scena apocalittica davanti a te. Non solo l'edificio dove lavoravi è stato raso al suolo ma la stessa sorte è toccata a tutta la città...`, {waitAfter: 3000})
				await this.CRT.printTyping(`Mentre l'oscurità della notte avanza, inizi a correre, per quanto ti è possibile, in direzione di casa tua, con la flebile speranza di poter riabbracciare la tua famiglia...`, {printDelay:50,waitAfter: 5000})
				await this.CRT.wait();
				await this.CRT.printTyping(`-FINE-`, {waitBefore: 1000, waitAfter: 1000})
				await this.byebye()
				return false;
			}
		}


		this.timedEvents = {
			earthquake: {
				start: 60,
				onLimit: async () => {
					await this.CRT.printTyping(`-RUMBLE-`,{blinking:true, nlBefore: 1, waitBefore: 1500});
					await this.CRT.printTyping(`Ed eccola la madre di tutte le scosse di terremoto!`, {waitBefore: 1500});
					await this.CRT.printTyping(`Le pareti si crepano e il soffitto crolla sopra di te...`,{printDelay: 75, waitBefore: 1500});
					await this.CRT.printTyping(`Non hai nemmeno il tempo di sentire dolore. Il buio ti avvolge...`,{printDelay: 75, nlAfter: 1, waitBefore: 2500});
					this.die();
				},
				steps: {
					50: async () => this.CRT.printTyping(`Ehi... mi è sembrato di sentire una vibrazione sotto i piedi...`,{nlBefore: 1, waitBefore: 1500}),
					39: async () => this.CRT.printTyping(`Un'altra... stavolta era proprio una scossa, l'ho avvertita bene!`,{nlBefore: 1, waitBefore: 1500}),
					27: async () => this.CRT.printTyping(`Accipicchia, questa era forte... è durata anche diversi secondi...`,{nlBefore: 1, waitBefore: 1500}),
					17: async () => this.CRT.printTyping(`Inizio a sentire degli scricchiolii...`,{nlBefore: 1, waitBefore: 1500}),
					12: async () => this.CRT.printTyping(`Ancora una piccola scossa... e nuovi scricchiolii...`,{nlBefore: 1, waitBefore: 1500}),
					7: async () => this.CRT.printTyping(`Un'altra scossa, stavolta più forte...`,{nlBefore: 1, waitBefore: 1500}),
					5: async () => this.CRT.printTyping(`L'ennesima scossa... abbastanza forte! Oscilla tutto qui! Sarà meglio sbrigarsi ad uscire!`,{nlBefore: 1, waitBefore: 1500}),
					
				}
			}
		}	
	}

	// Override di IFEngine.run
	async run(){
		await this.runSequence(`titolo`);
		this.CRT.clear();
		let a, r;
		a = await this.yesNoQuestion(`Vuoi leggere le istruzioni`)
		if (a) {
			this.CRT.println()
			await this.instructions()
			this.CRT.println()
			await this.CRT.wait();
		}
		this.CRT.clear();
		a = await this.yesNoQuestion(`Vuoi caricare una partita salvata precedentemente`)
		if (a) {
			this.CRT.println()
			r = await this.restore();
			if(r == true){
				return
			}
		}
		this.CRT.clear();
		this.enterRoom(this.startingRoom);
	}

	async instructions(){
		await this.CRT.printTyping(`Come per ogni avventura testuale, io sono il tuo alter ego. Puoi muovermi utilizzando le direzioni cardinali (nord, sud, est, ovest, alto, basso) o le loro iniziali.\n\nDi solito capisco frasi composte da un singolo comando (es: ESCI) oppure dal verbo + oggetto (es: PRENDI LA CHIAVE); frasi più complesse vanno al di là della mia comprensione.\nPer rileggere la descrizione del luogo dove sei usa il comando DOVE.\nPer vedere l'elenco degli oggetti che hai con te usa un comando tra I/INV/INVENTARIO.\nPuoi salvare e caricare i tuoi progressi quante volte vuoi (con i comandi SALVA e CARICA) a patto che il LocalStorage del browser sia attivo e non si cancelli in automatico ogni volta che lo chiudi!\n\nBuona fortuna e soprattutto buon divertimento!`);
	}

	// Override
	async die(){
		await this.CRT.printTyping(i18n.IFEngine.messages.death, {nlAfter: 1});
		this.displayMenu(this.menu.contextual); 
		return false;
	}

	maybeIKnowTheCode(){
		return I.calendario.read && O.libro.read
	}

	help(room){
		switch(room){
			default:
				return `Cerca di guardarti intorno ed esamina più cosa possibili. Spesso i dettagli si notano quando si prendono in mano gli oggetti!`
		}
	}

}

let A = new DemoAdventure;
A.start();