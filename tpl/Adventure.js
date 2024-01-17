class Adventure extends IFEngine {
	adventureData = {
		rooms: {
			startingRoom: {
				description: `Starting room`,
				interactors: {
					water: {
						pattern: `acqua`
					},
					oil: {
						pattern: `olio`
					}
				}
			}
		},
		objects: {
			bottle: {
				label: [
					`una bottiglia vuota`,
					`una bottiglia piena di acqua`,
					`una bottiglia piena d'olio`
				],
				pattern: `bottigli(?:a|etta)`,
				status: 0,
				visible: true,
				location: `startingRoom`,
				on: {
					fill: (subjects) => {
						let bottle = this.getObject("bottle")
						let fillwith = subjects[1]
						if (fillwith == this.currentRoom.interactors.water){
							bottle.status = 1
							return this.Thesaurus.defaultMessages.DONE
						}
						if (fillwith == this.currentRoom.interactors.oil){
							bottle.status = 2
							return this.Thesaurus.defaultMessages.DONE
						}
					}
				}
			}
		}
	}

	constructor(){
		super()
		let bottle = this.getObject("bottle")
		console.log(bottle)						
		this.Thesaurus.verbs.fill = {
			pattern: `riempi (.+) (?:con|di) (.+)`,
			complex: true,
			defaultMessage: this.Thesaurus.defaultMessages.NOT_POSSIBLE
		}

	}
	async run(){
		this.enterRoom(this.startingRoom)
	}
}