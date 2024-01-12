class Thesaurus{
	constructor(parent){
		this.parent = parent

		this.defaultMessages = {
			DONE: 					i18n.Thesaurus.defaultMessages.done,
			PREFER_NOT: 			i18n.Thesaurus.defaultMessages.preferNot,
			NOT_FOUND:	 			i18n.Thesaurus.defaultMessages.notFound,
			DONT_UNDERSTAND:		i18n.Thesaurus.defaultMessages.dontUnderstand,
			NOTHING_PARTICULAR:		i18n.Thesaurus.defaultMessages.dontNoticeAnythingInParticular,
			NOT_SEEN_HERE: 			i18n.Thesaurus.defaultMessages.notSeenHere, 
			DONT_HAVE_ANY: 			i18n.Thesaurus.defaultMessages.dontHaveAny, 
			NOTHING_HAPPENS: 		i18n.Thesaurus.defaultMessages.nothingHappens,
			BE_MORE_SPECIFIC: 		i18n.Thesaurus.defaultMessages.beMoreSpecific,
			NOT_POSSIBLE: 			i18n.Thesaurus.defaultMessages.notPossible,
			TOO_DARK_HERE: 			i18n.Thesaurus.defaultMessages.tooDarkHere,
			HERE: 					i18n.Thesaurus.defaultMessages.here,
			DOESNT_OPEN:			i18n.Thesaurus.defaultMessages.doesntOpen,
			DOESNT_CLOSE:			i18n.Thesaurus.defaultMessages.doesntClose,
			DOESNT_MOVE:			i18n.Thesaurus.defaultMessages.doesntMove
		}

		this.loadCommands();
		this.loadVerbs();
		
	}

	loadCommands(){
		this.commands = {
			north: {
				movement: true,
				pattern: i18n.Thesaurus.commands.north.pattern,
				defaultMessage: i18n.Thesaurus.commands.north.defaultMessage,
				direction: "n"
			},
			south: {
				movement: true,
				pattern: i18n.Thesaurus.commands.south.pattern,
				defaultMessage: i18n.Thesaurus.commands.south.defaultMessage,
				direction: "s"
			},
			est: {
				movement: true,
				pattern: i18n.Thesaurus.commands.east.pattern,
				defaultMessage: i18n.Thesaurus.commands.east.defaultMessage,
				direction: "e"
			},
			west: {
				movement: true,
				pattern: i18n.Thesaurus.commands.west.pattern,
				defaultMessage: i18n.Thesaurus.commands.west.defaultMessage,
				direction: "w"
			},
			up: {
				movement: true,
				pattern: i18n.Thesaurus.commands.up.pattern,
				defaultMessage: i18n.Thesaurus.commands.up.defaultMessage,
				direction: "u"
			},
			down: {
				movement: true,
				pattern: i18n.Thesaurus.commands.down.pattern,
				defaultMessage: i18n.Thesaurus.commands.down.defaultMessage,
				direction: "d"
			},
			save:{
				callback: async () =>{
					let res = await this.parent.save();
					return res;
				},
			},
			load: {
				callback: async () =>{
					let res = await this.parent.restore();
					return !res;
				},
			},
			instructions: {
				callback: async () => {
					await this.parent.instructions();
					return true;
				},
			},
			inventory: {
				callback: async () => {
					await this.parent._inventory();
					return true;
				},
			},
			quit: {
				callback: async () => {
					let answer = await this.parent.yesNoQuestion(i18n.IFEngine.questions.quitQuestion);
					if(answer){
						this.parent.displayMenu(this.parent.menu.contextual);
						return false;
					}
					return true;
				}
			},
			where: {
				callback: async () => {
					await this.parent.currentRoomDescription();
					return true;
				},
			},
			points: {
				callback: async () => {
					await this.parent._points();
					return true;
				},	
			}
		
		}
	}

	loadVerbs(){
		this.verbs = {
			open: {
				pattern: i18n.Thesaurus.verbs.open.pattern,
				defaultMessage: this.defaultMessages.DOESNT_OPEN
			},
			close: {
				pattern: i18n.Thesaurus.verbs.close.pattern,
				defaultMessage: this.defaultMessages.DOESNT_CLOSE

			},
			pull: {
				pattern: i18n.Thesaurus.verbs.pull.pattern,
				defaultMessage: this.defaultMessages.PREFER_NOT
			},
			press: {
				pattern: i18n.Thesaurus.verbs.press.pattern,
				defaultMessage: this.defaultMessages.PREFER_NOT
			},
			push: {
				pattern: i18n.Thesaurus.verbs.push.pattern,
				defaultMessage: this.defaultMessages.DOESNT_MOVE
			},
			take: {
				pattern: i18n.Thesaurus.verbs.take.pattern,
				defaultMessage: this.defaultMessages.PREFER_NOT
			},		
			drop: {
				inventory: true,
				pattern: i18n.Thesaurus.verbs.drop.pattern,
				defaultMessage: this.defaultMessages.PREFER_NOT
			},
			give: {
				inventory: true,
				pattern: i18n.Thesaurus.verbs.give.pattern,
				complex: true,
				defaultMessage: this.defaultMessages.PREFER_NOT
			},
			useWith: {
				inventory: true,
				pattern: i18n.Thesaurus.verbs.useWith.pattern,
				complex: true,
				defaultMessage: this.defaultMessages.NOTHING_HAPPENS
			},
			lookAt: {
				pattern: i18n.Thesaurus.verbs.lookAt.pattern,
				defaultMessage: this.defaultMessages.NOTHING_PARTICULAR
			},
			search:{
				pattern: i18n.Thesaurus.verbs.search.pattern,
				defaultMessage: this.defaultMessages.NOT_FOUND
			}
		};
	}
}
