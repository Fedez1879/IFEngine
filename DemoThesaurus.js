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
					pattern: "(infila|inserisci) (.+) in (.+)",
					defaultMessage: this.defaultMessages.BE_SERIOUS,
					inventory: true,
					complex: true
				},
				break: {
					pattern: "rompi|distruggi|spacca",
					defaultMessage: this.defaultMessages.BE_SERIOUS
				},
				wear: {
					pattern: `indossa`,
					defaultMessage: this.defaultMessages.BE_SERIOUS
				},
				bringCloser: {
					pattern: `avvicina (.+)? a (.+)`,
					defaultMessage: this.defaultMessages.NOTHING_HAPPENS,
					inventory: true,
					complex: true
				}
			}
		};
	}
}
