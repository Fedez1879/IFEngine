class AdventureEngine extends IFEngine{
	
	constructor(){
		super();
		
		this.Thesaurus = new AdventureThesaurus(this)

		this.CRT.capsLock = true;
		
		

	}

	// Override di IFEngine.run
	async run(){
		await this.enterRoom(this.startingRoom);
	}

}
