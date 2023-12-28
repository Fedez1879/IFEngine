class Thesaurus{
	constructor(){
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
			NON_E_POSSIBILE: 		i18n.Thesaurus.defaultMessages.notPossible,
			TOO_DARK_HERE: 			i18n.Thesaurus.defaultMessages.tooDarkHere
		}

		this.loadCommands();
		this.loadVerbs();
		
	}

	loadCommands(){
		this.commands = {
			north: {
				movimento: true,
				pattern: i18n.Thesaurus.commands.north.pattern,
				defaultMessage: i18n.Thesaurus.commands.north.defaultMessage,
				direzione: "n"
			},
			south: {
				movimento: true,
				pattern: i18n.Thesaurus.commands.south.pattern,
				defaultMessage: i18n.Thesaurus.commands.south.defaultMessage,
				direzione: "s"
			},
			est: {
				movimento: true,
				pattern: i18n.Thesaurus.commands.east.pattern,
				defaultMessage: i18n.Thesaurus.commands.east.defaultMessage,
				direzione: "e"
			},
			west: {
				movimento: true,
				pattern: i18n.Thesaurus.commands.west.pattern,
				defaultMessage: i18n.Thesaurus.commands.west.defaultMessage,
				direzione: "w"
			},
			up: {
				movimento: true,
				pattern: i18n.Thesaurus.commands.up.pattern,
				defaultMessage: i18n.Thesaurus.commands.up.defaultMessage,
				direzione: "u"
			},
			down: {
				movimento: true,
				pattern: i18n.Thesaurus.commands.down.pattern,
				defaultMessage: i18n.Thesaurus.commands.down.defaultMessage,
				direzione: "d"
			}
		}
	}

	loadVerbs(){
		this.verbs = {
			open: {
				pattern: i18n.Thesaurus.verbs.open.pattern,
				defaultMessage: i18n.Thesaurus.verbs.open.defaultMessage
			},
			close: {
				pattern: i18n.Thesaurus.verbs.close.pattern,
				defaultMessage: i18n.Thesaurus.verbs.close.defaultMessage

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
				defaultMessage: i18n.Thesaurus.verbs.push.defaultMessage
			},
			take: {
				pattern: i18n.Thesaurus.verbs.take.pattern,
				defaultMessage: this.defaultMessages.PREFER_NOT
			},		
			drop: {
				inventario: true,
				pattern: i18n.Thesaurus.verbs.drop.pattern,
				defaultMessage: this.defaultMessages.PREFER_NOT
			},
			give: {
				inventario: true,
				pattern: i18n.Thesaurus.verbs.give.pattern,
				complex: true,
				defaultMessage: this.defaultMessages.PREFER_NOT
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
