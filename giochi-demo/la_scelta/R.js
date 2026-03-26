class R{
	static piazza = {
		label: `Piazza del Borgo`,
		first_enter: true,
		description: function(){ return (this.first_enter ? `Ti risvegli` : `Sei`) +` al centro di una piazza deserta. Le imposte delle case sono chiuse, il vento trascina polvere tra i ciottoli e, sopra di te, il campanile domina il borgo come un giudice silenzioso. Alla tua sinistra c'e una casa con la porta socchiusa. Al centro della piazza si apre un pozzo di pietra nera. In lontananza, una campana suona un solo rintocco.`},
		interactors: [],
		objects: [],
		choice: {
			label: i18n.IFEngine.menu.choose,
			options: {
				1: {
					label: `salire sul campanile`,
					callback: async () => A.enterRoom(this.campanile)
				},
				2: {
					label: `entrare nella casa`,
					callback: async () => A.enterRoom(this.casa)
				},
				3: {
					label: `guardare nel pozzo`,
					callback: async () => A.enterRoom(this.pozzo)
				}
			}
		},
		afterExit: function(){ console.log("afterExit");this.first_enter = false }
	}

	static casa = {
		label: `Casa Silenziosa`,
		description: `La casa e fredda, ma non abbandonata. Un tavolo e apparecchiato per una cena che nessuno ha mai consumato. Accanto a un piatto intatto c'e una lettera sigillata, ingiallita dal tempo. Fuori, la campana rintocca una seconda volta e il legno delle pareti sembra trattenere il respiro.`,
		interactors: [],
		objects: [],
		choice: {
			label: i18n.IFEngine.menu.choose,
			options: {
				1: {
					label: `leggere la lettera`,
					callback: async () => A.enterRoom(this.lettera)
				},
				2: {
					label: `tornare in piazza`,
					callback: async () => A.enterRoom(this.piazza)
				}
			}
		}
	}

	static lettera = {
		label: `La Lettera`,
		description: `Rompi il sigillo con dita che tremano. Il foglio contiene poche righe, scritte da una mano disperata: "La campana non chiama i vivi, ma chi porta una colpa. Quando suonera dodici volte, qualcuno dovra scegliere se salvare il borgo, una sola anima, o se stesso." In fondo alla pagina c'e una frase piu piccola: "Il pozzo ricorda cio che il campanile giudica."`,
		interactors: [],
		objects: [],
		choice: {
			label: i18n.IFEngine.menu.choose,
			options: {
				1: {
					label: `cercare risposte al pozzo`,
					callback: async () => A.enterRoom(this.pozzo)
				},
				2: {
					label: `salire sul campanile`,
					callback: async () => A.enterRoom(this.campanile)
				},
				3: {
					label: `lasciare la casa e tornare in piazza`,
					callback: async () => A.enterRoom(this.piazza)
				}
			}
		}
	}

	static pozzo = {
		label: `Il Pozzo`,
		description: `Ti sporgi oltre il bordo di pietra. Non vedi acqua. Sul fondo giacciono decine di campanelle spezzate, come se qualcuno avesse provato per anni a soffocare un richiamo impossibile. Dal buio sale un sussurro che pronuncia il tuo nome con una voce che conosci, ma che non riesci ancora a collocare.`,
		interactors: [],
		objects: [],
		choice: {
			label: i18n.IFEngine.menu.choose,
			options: {
				1: {
					label: `scendere nel pozzo`,
					callback: async () => A.enterRoom(this.fondo_pozzo)
				},
				2: {
					label: `allontanarsi e correre al campanile`,
					callback: async () => A.enterRoom(this.campanile)
				},
				3: {
					label: `tornare in piazza`,
					callback: async () => A.enterRoom(this.piazza)
				}
			}
		}
	}

	static fondo_pozzo = {
		label: `Fondo del Pozzo`,
		description: `Il fondo e asciutto e coperto di polvere antica. Tra le campanelle spezzate trovi un medaglione d'argento. Quando lo apri, la miniatura all'interno ti mostra il tuo stesso volto, piu giovane e colmo di paura. In quell'istante ti attraversa un ricordo: questa notte non e la prima. Sei gia arrivato qui, e ogni volta hai scelto di dimenticare.`,
		interactors: [],
		objects: [],
		choice: {
			label: i18n.IFEngine.menu.choose,
			options: {
				1: {
					label: `prendere il medaglione e ricordare tutto`,
					callback: async () => A.enterRoom(this.finale_verita)
				},
				2: {
					label: `lasciare il medaglione e salire al campanile`,
					callback: async () => A.enterRoom(this.campanile)
				}
			}
		}
	}

	static campanile = {
		label: `Campanile`,
		description: `Gli scalini di pietra si arrampicano nel buio come una spina dorsale. In cima ti attende la campana, enorme, immobile, e accanto ad essa una figura velata. Non ha lineamenti, eppure senti il peso del suo sguardo. Il vento odora di pioggia e cenere. Da qui il borgo sembra trattenuto in un istante che non vuole finire.`,
		interactors: [],
		objects: [],
		choice: {
			label: i18n.IFEngine.menu.choose,
			options: {
				1: {
					label: `parlare con la figura`,
					callback: async () => A.enterRoom(this.figura)
				},
				2: {
					label: `suonare la campana`,
					callback: async () => A.enterRoom(this.finale_amaro)
				},
				3: {
					label: `scendere in piazza`,
					callback: async () => A.enterRoom(this.piazza)
				}
			}
		}
	}

	static figura = {
		label: `La Figura Velata`,
		description: `La figura inclina il capo, e dalla stoffa senza volto esce una voce calma, ferita: "Mi avevi promesso che saresti tornato." Allora ricordi. Anni prima, quando il borgo stava per bruciare, tu hai avuto il tempo di compiere una sola scelta: salvare tutti oppure salvare lei. Hai scelto il paese. La ragazza davanti a te e cio che resta di quella promessa infranta.`,
		interactors: [],
		objects: [],
		choice: {
			label: i18n.IFEngine.menu.choose,
			options: {
				1: {
					label: `chiedere perdono`,
					callback: async () => A.enterRoom(this.perdono)
				},
				2: {
					label: `negare ogni colpa e fuggire`,
					callback: async () => A.enterRoom(this.finale_amaro)
				},
				3: {
					label: `suonare la campana senza ascoltare oltre`,
					callback: async () => A.enterRoom(this.finale_amaro)
				}
			}
		}
	}

	static perdono = {
		label: `Il Prezzo`,
		description: `La figura ti sfiora appena la mano, gelida come acqua d'inverno. "Il borgo puo essere liberato" sussurra, "ma ogni debito chiede qualcuno che resti a portarne il peso. Se accetterai, all'alba tornera la vita. Se rifiuterai, la notte ricomincera e tu sarai salvo soltanto a meta." La campana vibra da sola, in attesa della tua ultima risposta.`,
		interactors: [],
		objects: [],
		choice: {
			label: i18n.IFEngine.menu.choose,
			options: {
				1: {
					label: `sacrificarti per spezzare la maledizione`,
					callback: async () => A.enterRoom(this.finale_buono)
				},
				2: {
					label: `rifiutare e salvare te stesso`,
					callback: async () => A.enterRoom(this.finale_amaro)
				}
			}
		}
	}

	static finale_buono = {
		label: `Alba`,
		description: `Afferri la corda della campana e pronunci il tuo assenso. Il bronzo canta una nota cosi profonda da far tremare il cielo. Le case del borgo si riempiono di luce, le finestre si aprono, il fumo torna a salire dai camini spenti da anni. Tu resti nel campanile, sempre piu leggero, mentre il mondo sotto di te riprende a vivere. Nessuno ricordera il tuo nome, ma tutti avranno un domani.`,
		interactors: [],
		objects: [],
		choice: {
			label: i18n.IFEngine.menu.choose,
			options: {
				1: {
					label: `ricominciare la storia`,
					callback: async () => A.restart(false)
				},
				2: {
					label: `terminare il gioco`,
					callback: async () => A.byebye()
				}
			}
		}
	}

	static finale_amaro = {
		label: `Il Richiamo`,
		description: `Scegli di non guardare fino in fondo dentro la tua colpa. Ti allontani dal campanile, dal borgo, da quella voce che continuava a chiamarti. Eppure, anche quando l'alba arriva, non sei davvero libero. Ovunque andrai, ogni notte, sentirai la campana suonare in lontananza. Non saprai piu se stia chiamando te o cio che hai lasciato indietro.`,
		interactors: [],
		objects: [],
		choice: {
			label: i18n.IFEngine.menu.choose,
			options: {
				1: {
					label: `ricominciare la storia`,
					callback: async () => A.restart(false)
				},
				2: {
					label: `terminare il gioco`,
					callback: async () => A.byebye()
				}
			}
		}
	}

	static finale_verita = {
		label: `La Verita`,
		description: `Stringi il medaglione e i ricordi tornano come acqua che rompe una diga. Non c'e nessun mostro nel borgo, nessun demone nascosto nella campana: c'e solo la tua scelta, ripetuta all'infinito perche non hai mai avuto il coraggio di guardarla davvero. Capisci allora che il campanile non vuole punirti. Vuole soltanto una risposta definitiva. Con il cuore scoperto, risali verso la torre per decidere chi essere.`,
		interactors: [],
		objects: [],
		choice: {
			label: i18n.IFEngine.menu.choose,
			options: {
				1: {
					label: `salire al campanile e affrontare la scelta finale`,
					callback: async () => A.enterRoom(this.figura)
				},
				2: {
					label: `ricominciare da capo`,
					callback: async () => A.restart(false)
				}
			}
		}
	}
}
