class DemoThesaurus extends Thesaurus{
	commonPatterns = {
		wall: i18n.DemoThesaurus.commonPatterns.wall,
		floor: i18n.DemoThesaurus.commonPatterns.floor,
		ceiling: i18n.DemoThesaurus.commonPatterns.ceiling,
	}

	constructor(parent){
		super(parent),
		this.defaultMessages.BE_SERIOUS = "Sii serio!"

		this.loadCommands();
		this.loadVerbs();
		
	}
	
	loadVerbs(){
		super.loadVerbs()
		this.verbs = {
			...this.verbs, 
			...{
				move:{
					pattern: `sposta|muovi`,
					defaultMessage: `Non si muove.`
				},
				lift:{
					pattern: `alza|solleva`,
					defaultMessage: `Non si muove.`
				},
				read:{
					pattern: `leggi`,
					defaultMessage: this.defaultMessages.PREFER_NOT
				},
				putInto: {
					inventory: true,
					pattern: "(infila|inserisci) (.+) in (.+)",
					complex: true,
					defaultMessage: this.defaultMessages.BE_SERIOUS
				},
				break: {
					pattern: "rompi|distruggi|spacca",
					defaultMessage: this.defaultMessages.BE_SERIOUS
				}
			}
		};
	}
}
