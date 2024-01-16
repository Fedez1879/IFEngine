class AdventureThesaurus extends Thesaurus{
	constructor(parent){
		super(parent)
	}
	
	loadCommands(){
		super.loadCommands()
		this.commands = {
			...this.commands,
			...{
				pippo: {
					pattern: `pippo`,
					callback: () => `e pluto.`
				}
			}
		}
	}

}
