class Adventure extends AdventureEngine{
	adventureData = {
		
		/* STANZE */
		rooms: {

			startingRoom: {
				label: `Stanza centrale`,
				description: `Sei nella stanza centrale e questa è la descrizione lunga della stanza centrale`,
				shortDescription: `Sei nella stanza centrale`,
				directions: {
					n: () => this.currentRoom.interactors.door.status ? this.enterRoom(`roomNorth`) : `La porta è chiusa`
					//s: `southRoom`
				},
				scenic: {
					pattern: [`roba`],
					defaultMessage: `La roba non è importante`
				},
				interactors: {
					door: {
						label: [
							`una porta chiusa`,
							`una porta aperta`
						],
						status: 0,
						visible: true,
						pattern: `porta`,
						description: `E' di legno massiccio`,
						on: {
							open: () => {
								this.currentRoom.interactors.door.status = 1;
								return this.Thesaurus.defaultMessages.DONE
							},
							close: () => {
								this.currentRoom.interactors.door.status = 0;
								return this.Thesaurus.defaultMessages.DONE
							},

						}
					}
				}
			}

		},

		/* OGGETTI */
		objects: {

			key: {
				label: `una chiave`,
				pattern: `chiave`,
				description: `E' piccola e dorata.`,
				location: `startingRoom`,
				visible: true,
			}
		}
	}
}
