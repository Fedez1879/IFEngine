class DemoAdventure extends IFEngine{
	
	constructor(){
		super();
		
		document.title = i18n.htmlTitle;

		this.CRT.defaultCR = `\n`;
		this.defaultInput = `\n] `
		this.startingRoom = R.piazza;

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
				
			}
		}


		this.timedEvents = {
		}	
	}

	// Override di IFEngine.run
	async run(){
		await this.runSequence(`titolo`);
		this.CRT.clear();
		this.enterRoom(this.startingRoom);
	}

	// Override
	async die(){
		await this.CRT.printTyping(i18n.IFEngine.messages.death, {nlAfter: 1});
		this.displayMenu(this.menu.contextual); 
		return false;
	}

	
	async input(){
		// Attendo il comando
		this.CRT.println();
		this.displayMenu(this.AD.currentRoom.choice)
		return false;
	}

	reload(stored){
		let tbr = JSON.parse(stored)
		
		for(let k in tbr.I){

			if (tbr.I[k].visible === undefined)
				delete I[k].visible
			
			I[k] = {
				...I[k],
				...tbr.I[k]
			}

		}

		for(let k in tbr.O){
			if (tbr.O[k].visible === undefined)
				delete O[k].visible
			
			O[k] = {
				...O[k],
				...tbr.O[k]
			}

			if(O[k].linkedObjects)
				O[k].linkedObjects = O[k].linkedObjects.map((e) => O[e])
		}



		for(let k in tbr.R){
			let R_S = {...R[k]};
			
			R[k] = {
				...R[k],
				...tbr.R[k]
			}
			
			R[k].choice = R_S.choice

			if(R[k].interactors)
				R[k].interactors = R[k].interactors.map((e) => I[e])
			if(R[k].objects)
				R[k].objects = R[k].objects.map((e) => O[e])
		}

		this.AD.currentRoom = R[tbr.currentRoom]
		this.AD.inventory = []

		for(let ok of tbr.inventory)
			this.AD.inventory.push(O[ok])
                   
		this.otherData = tbr.otherData;
		this.activeTimedEvents = [];
		for (let te in this.otherData.timedEventSteps){
			this.activeTimedEvents.push(te)
		}

	}
}

let A = new DemoAdventure;
A.start();