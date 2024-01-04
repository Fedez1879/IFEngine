class DemoEngine extends IFEngine{
	
	constructor(){
		super();
		
		document.title = i18n.htmlTitle;

		this.CRT.defaultCR = "\n";
		this.defaultInput = "\n] "
		this.startingRoom = "quasiFuori";

		this.Thesaurus = new DemoThesaurus(this)

		this.Thesaurus.commands.save.pattern = "save|salva";
		this.Thesaurus.commands.load.pattern = "load|carica";
		this.Thesaurus.commands.inventory.pattern = "i(?:nv)?|inventario";
		this.Thesaurus.commands.where.pattern = "dove(?:sono|mi trovo)?";
		this.Thesaurus.commands.instructions.pattern = "istruzioni";
		
		this.CRT.sleep = (ms) => true; // for speed test

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

		}

	}

	// Override di IFEngine.run
	async run(){
		await this.runSequence("titolo");
		this.CRT.clear();
		let a = await this.yesNoQuestion("Vuoi leggere le istruzioni")
		if (a) {
			await this.instructions()
			this.CRT.println()
			await this.CRT.wait();
		}
		this.CRT.clear();
		await this.enterRoom(this.startingRoom)
	}

	async instructions(){
		await this.CRT.printTyping("Come per ogni avventura testuale, io sono il tuo alter ego. Puoi muovermi attraverso le direzioni cardinali (nord, sud, est, ovest, alto, basso) o le loro iniziali.\n\nDi solito capisco frasi fatte da un singolo COMANDO (es: salta) oppure dal VERBO + OGGETTO (es: prendi la chiave); frasi più complesse vanno al di là della mia comprensione.\nPuoi salvare e caricare i tuoi progressi quante volte vuoi (con i comandi SALVA e CARICA) a patto che il LocalStorage del browser sia attivo e non si cancelli in automatico ogni volta che chiudi il browser!\n\nBuona fortuna e soprattutto buon divertimento!");
	}


}
