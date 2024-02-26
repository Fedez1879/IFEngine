class R{
	static ufficio = {
		label: `Ufficio`,
		description: `Sei nel tuo ufficio. La scrivania è come sempre piena di appunti. Di fronte a te, le ante vetrate del mobile riflettono il tuo viso pallido. Dalla finestra a ovest entra una fioca luce arancione.`,
		scenic: {
			pattern: [`chiodo`, `ruot(?:a|e)`, `viso`, `riflesso`, `ganci(?:o)?`, `vetro`,`macchin(?:a|e)|auto(?:mobil(e|i)?)?`],
			defaultMessage: `Lascia perdere, concentrati piuttosto su come trovare il modo di uscire da qui..`
		},
		interactors: [I.porta, I.lettoreBadge],
		objects: [O.occhiali, O.piumino, O.scatola, O.chiave_rossa, O.chiave_blu],
		e: () => I.porta.open ? R.stanza : `La porta dell'ufficio è chiusa.`,
		afterEnter: () => A.startTimedEvent(`earthquake`),
		on_exit: function(){
			console.log(this)
			return A.go("e")
		}
	}

	static stanza = {
		label: `Stanza`,
		description: `Sei nella stanza accanto al tuo ufficio`,
		interactors: [I.porta],
		w: () => I.porta.open ? R.ufficio : `La porta dell'ufficio è chiusa.`
	}	
}
