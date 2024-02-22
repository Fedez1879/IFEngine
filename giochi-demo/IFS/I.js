class I{
	static porta = {
		pattern: `porta`,
		locked:true,
		open:false,
		description: `E' la porta del tuo ufficio. Non ha serrature, solo un pomolo. Accanto ad essa c'è un lettore badge.`,
		on_lookAt: function(){
			return A.discover(I.lettoreBadge)
		},
		on_open: function(){
			if(this.locked) 
				return `Provi a tirare il pomolo della porta, ma non si apre. Sembra bloccata...`
			if(this.open)
				return `La porta è già aperta`
			this.open = true
			return `La porta è aperta adesso.`

		},
		on_close: function(){
			if(this.locked || this.open == false) 
				return `La porta è già chiusa`
			this.locked = true;
			this.open = false
			return `La porta è chiusa adesso.`
		}
	}

	static lettoreBadge = {
		label: 'un lettore badge',
		pattern: `lettore(?: badge)?`,
		description: function(){
			return this.visible ? `E' un lettore RFID, credo serva per aprire la porta col badge personale.` : `Mi sembrava di aver visto un lettore badge... ma dove?`
		}
	}	
}