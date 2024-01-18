class DemoThesaurus extends Thesaurus{
	commonPatterns = {
		wall: i18n.DemoThesaurus.commonPatterns.wall,
		floor: i18n.DemoThesaurus.commonPatterns.floor,
		ceiling: i18n.DemoThesaurus.commonPatterns.ceiling,
		outside: i18n.DemoThesaurus.commonPatterns.outside
	}

	constructor(parent){
		super(parent)
		this.defaultMessages.BE_SERIOUS = i18n.DemoThesaurus.defaultMessages.beSerious
		this.defaultMessages.NOT_NOW = i18n.DemoThesaurus.defaultMessages.notNow
		this.defaultMessages.DONE = i18n.DemoThesaurus.defaultMessages.done
		this.loadVerbs()
		this.loadCommands()
	}
	
	loadVerbs(){
		super.loadVerbs()
		this.verbs = {
			...this.verbs, 
			...{
				move:{
					pattern: `sposta|muovi`,
					defaultMessage: this.verbs.push.defaultMessage
				},
				lift:{
					pattern: `alza|solleva`,
					defaultMessage: this.verbs.push.defaultMessage
				},
				read:{
					pattern: `leggi|sfoglia`,
					defaultMessage: this.defaultMessages.PREFER_NOT
				},
				putInto: {
					pattern: `(infila|inserisci) (.+) in (.+)`,
					defaultMessage: this.defaultMessages.BE_SERIOUS,
					inventory: true,
					complex: true
				},
				break: {
					pattern: `rompi|distruggi|spacca`,
					defaultMessage: this.defaultMessages.BE_SERIOUS
				},
				wear: {
					pattern: `indossa|infila|metti`,
					defaultMessage: this.defaultMessages.BE_SERIOUS,
				},
				takeOff: {
					pattern: `togli|leva`,
					defaultMessage: this.defaultMessages.NOT_POSSIBLE,
					inventory: true
				},
				bringCloser: {
					pattern: `(avvicina|appoggia|metti) (.+) (?:a|su) (.+)`,
					defaultMessage: this.defaultMessages.NOTHING_HAPPENS,
					inventory: true,
					complex: true
				},
				tidy: {
					pattern: `riordina|metti in ordine|sistema`,
					defaultMessage: this.defaultMessages.NOT_NOW,
				},
				unplug: {
					pattern: `stacca`,
					defaultMessage: this.defaultMessages.PREFER_NOT,
				},
				turnOn: {
					pattern: `accendi`,
					defaultMessage: this.defaultMessages.NOT_POSSIBLE	
				},
				turnOff: {
					pattern: `spengi|spegni`,
					defaultMessage: this.defaultMessages.NOT_POSSIBLE	
				},
				follow: {
					pattern: `(?:in)?segui`,
					defaultMessage: this.defaultMessages.NOT_POSSIBLE	
				}
			}
		};
	}

	loadCommands(){
		super.loadCommands()
		this.commands = {
			...this.commands,
			...{
				exit: {
					pattern: i18n.DemoThesaurus.commands.exit.pattern,
					defaultMessage: i18n.DemoThesaurus.commands.exit.defaultMessage
				},
				help: {
					pattern: i18n.DemoThesaurus.commands.help.pattern,
					defaultMessage: () => this.parent.help(this.parent.currentRoom)
				},
				run: {
					pattern: i18n.DemoThesaurus.commands.run.pattern,
					defaultMessage: i18n.DemoThesaurus.commands.run.defaultMessage
				}
			}
		}
	}

}
