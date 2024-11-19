class O{
	static occhiali = {
		label: `un paio di occhiali`,
		pattern: `(?:paio (?:di )?)?occhiali`,
		description: function(){ 
			return (A.playerHas(this) ? `Sono` : `Sembrano`) + ` occhiali per astigmatici e ipermetropi.`
		},
		initialDescription: `Ci sono un paio di occhiali sulla scrivania.`,
		visible: true,
		once: false,
		worn: false,
		'on_lift|on_turnOn': `Ma dai!`,
		on_take: function(){
			let answer;
			if(!this.once) {
				this.once = true;
				answer = `Guardandoli da vicino ti accorgi che sono i tuoi occhiali da vista. Quindi li indossi...\nOra è tutto MOLTO più chiaro e definito!`
			} else {
				answer = `Sono proprio i tuoi occhiali, per fortuna li hai ritrovati! Li indossi nuovamente.`
			}
			A.addInInventory(this);
			return answer
		},
		on_wear: function(){
			if(!A.playerHas(this))
				return this.on_take()
			return `Sono già sul tuo naso!`
		},
		on_takeOff: function(){
			return this.on_drop
		},
		on_drop: () => `Meglio di no, non ci vedi molto bene senza!`
	}

	static taschePiumino = {
		visible: false,
		pattern: `tasc(?:a|he)`,
		on_lookAt: function(){
			//if(O.badge.visible)
				return `Dopo un'attenta ispezione concludi che sono tutte e quattro vuote.`
			/*
			A.discover(O.badge)
			if(A.playerHas(O.piumino))
				A.addInInventory(O.badge)
			return `Da una di esse estrai un oggetto rigido... è il tuo badge personale!`;
			*/
		},
		on_open: function(){ return this.on_lookAt }
	}

	static piumino = {
		label: `un piumino nero`,
		pattern: `(piumino|giacc(?:a|etto))(?: ner(?:o|a))?`,
		description: function() {
			return `E' un piumino nero`+ (A.playerHas(O.occhiali) == false ? `. Sembra`:``)+` leggero, primaverile.`+ ((O.taschePiumino.visible === undefined) ? `\nHa quattro tasche, due interne e due esterne.`:``)
		},
		linkedObjects: [O.taschePiumino],
		visible: true,
		worn:false,
		on_lookAt: function(){
			if (A.playerHas(this))
				A.discover(O.taschePiumino, true)
			return null
		},
		on_wear: function(){
			if (!A.playerHas(this)){
				A.addInInventory(this)
			}
			return A.wear(this, `Mi sta proprio bene.`)
		},
		on_takeOff: function(){
			return A.takeOff(this)
		},
		on_drop: function(){
			if (A.AD.currentRoom == R.ufficio){
				A.removeFromInventory(this)
				return `Lo rimetti nell'attaccapanni.`
			}
		},
	}

	static pila = {
		label: ['una pila','una pila scarica'],
		status: 0,
		pattern: 'pila',
		visible: false
	}

	static scatola = {
		label: 'una scatola',
		pattern: 'scatola',
		description: function() {
			return this.linkedObjects.length ? `ci sono degli oggetti dentro` : `è vuota`
		},
		initialDescription: `Appoggiata su un tavolo c'è una scatola.`,
		on_open: `è già aperta`,
		on_lookAt: function() {
			return this.description()
		},
		container: true,
		linkedObjects: [O.pila, O.piumino]
	}

	static chiave_rossa = {
		label: 'una chiave rossa',
		pattern: 'chiave rossa|chiave',
		visible: true,
		description: `una chiave di colore rosso`
	}

	static chiave_blu = {
		label: 'una chiave blu',
		pattern: 'chiave blu|chiave',
		visible: true,
		description: `una chiave di colore blu`
	}

}