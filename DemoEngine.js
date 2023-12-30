class DemoEngine extends IFEngine{
	
	constructor(){
		super();
		
		document.title = i18n.htmlTitle;

		this.CRT.defaultCR = "\n";
		this.defaultInput = "\n] "
		this.startingRoom = "ufficio";

		this.Thesaurus = new DemoThesaurus(this)

		this.Thesaurus.commands.save.pattern = "(save|salva)";
		this.Thesaurus.commands.load.pattern = "(load|carica)";
		this.Thesaurus.commands.inventory.pattern = "(i(?:nv)?|inventario)";

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
		await this.enterRoom(this.startingRoom)
	}

	playerHas(object){
		return this._get(object.key, this.inventory);
	}

}
