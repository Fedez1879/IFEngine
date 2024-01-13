class DemoEngine extends IFEngine{
	
	constructor(){
		super();
		
		document.title = i18n.htmlTitle;

		this.CRT.defaultCR = `\n`;
		this.defaultInput = `\n] `
		this.startingRoom = `ufficio`;

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
		await this.enterRoom(this.startingRoom);
	}

	async instructions(){
		await this.CRT.printTyping(`Come per ogni avventura testuale, io sono il tuo alter ego. Puoi muovermi utilizzando le direzioni cardinali (nord, sud, est, ovest, alto, basso) o le loro iniziali.\n\nDi solito capisco frasi composte da un singolo comando (es: ESCI) oppure dal verbo + oggetto (es: PRENDI LA CHIAVE); frasi più complesse vanno al di là della mia comprensione.\nPer rileggere la descrizione del luogo dove sei usa il comando DOVE.\nPer vedere l'elenco degli oggetti che hai con te usa uno comando tra I/INV/INVENTARIO.\nPuoi salvare e caricare i tuoi progressi quante volte vuoi (con i comandi SALVA e CARICA) a patto che il LocalStorage del browser sia attivo e non si cancelli in automatico ogni volta che lo chiudi!\n\nBuona fortuna e soprattutto buon divertimento!`);
	}

	// Override
	async die(){
		await this.CRT.printTyping(i18n.IFEngine.messages.death, {nlAfter: 1});
		this.displayMenu(this.menu.contextual); 
		return false;
	}

	maybeIKnowTheCode(){
		return this.adventureData.rooms.ufficio.interactors.calendario.read && this.getObject(`libro`).read
	}

	help(room){
		switch(room){
			default:
				return `Cerca di guardarti intorno ed esamina più cosa possibili. Spesso i dettagli si notano quando si prendono in mano gli oggetti!`
		}
	}

}
