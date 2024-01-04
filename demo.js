class Adventure extends DemoEngine{
	adventureData = {
		// stanza iniziale
		prologue: true,
		
		/* STANZE */
		rooms: {

			ufficio: {
				label: "Ufficio",
				description: () => {
					return "Sei nel tuo ufficio. La scrivania è come sempre piena di appunti. Di fronte a te, il moderno mobile a vetri riflette il tuo viso pallido. Dalla finestra a ovest entra una fioca luce arancione."
				},
				directions: {
					e: () => this.currentRoom.interactors.porta.aperta ? this.enterRoom("corridoio") : `La porta dell'ufficio è chiusa.`
				},
				interactors: {
					ufficio: {
						pattern: "ufficio",
						description: () => this.currentRoom.description()
					},
					luce: {
						pattern: `luce`,
						description: "E' la flebile luce del tramonto."
					},
					pareti: {
						...this.commonInteractors.wall,
						...{
							description: () => "Nella parete di fronte, c'è il modile a vetri, in quella a est c'è la porta di ingresso. Nella parete opposta alla porta c'è l'unica finestra della stanza.\nLa parete dietro di te è completamente spoglia, a parte "+(this.playerHas(this.adventureData.objects.occhiali) ? "": "(credo) ")+ "un calendario appeso."
						}
					},
					mobile: {
						pattern: "mobile",
						aperto:false,
						description: async () => {
							await this.CRT.printTyping(`Ha le ante di vetro che lasciano intravedere dei libri al suo interno.`);
							if( this.currentRoom.interactors.attaccapanni.visible == false){
								await this.CRT.sleep(1500);
								await this.CRT.printTyping(`Di fianco al mobile c'è un attaccapanni, mica l'avevo notato prima!`)
								this.discover(this.currentRoom.interactors.attaccapanni)
							}
						},
						on: {
							lookAt: () => {
								this.discover(this.currentRoom.interactors.libri)
								return this.currentRoom.interactors.mobile.description()
							},
							open: () => {
								this.currentRoom.interactors.mobile.aperto = true;
								return this.Thesaurus.defaultMessages.DONE
							},
							close: () => {
								this.currentRoom.interactors.mobile.aperto = false;
								return this.Thesaurus.defaultMessages.DONE
							}
						}
					},
					ante: {
						pattern: `ant(?:a|e)`,
						description: "Le ante del mobile sono in vetro scuro e spesso. sono discretamente riflettenti.",
						on: {
							open: () => {
								this.currentRoom.interactors.mobile.aperto = true;
								return this.Thesaurus.defaultMessages.DONE
							},
							close: () => {
								this.currentRoom.interactors.mobile.aperto = false;
								return this.Thesaurus.defaultMessages.DONE
							}
						}
					},
					libri: {
						label: 'alcuni libri',
						pattern: `libri`,
						visible: false,
						description: () => this.currentRoom.interactors.mobile.aperto ? (this.playerHas(this.adventureData.objects.occhiali) ? `Sono tutti libri di programmazione: PHP, JAVA, PYTHON...` + (!this.adventureData.objects.libro.visible ? `C'è nè uno diverso dagli altri...` : ``) : `Sulle costole dei libri ci sono scritti i vari titoli, purtroppo senza occhiali non riesco a distinguere bene i caratteri...`) : `Forse dovrei aprire le ante per esaminarli meglio`,
						on: {
							lookAt: () => this.discover(this.adventureData.objects.libro)
						}
					},
					calendario: {
						pattern: "calendario",
						analizzato: false,
						description: () => "E' un calendario vecchio, del 1979." + (this.playerHas(this.adventureData.objects.occhiali) ? " Attualmente mostra il mese di ottobre. Il giorno 18 è cerchiato in rosso." : "")
					},
					attaccapanni: {
						label: "un attaccapanni",
						pattern: "attaccapanni|appendiabiti",
						visible: false,
						description: () => "E' di metallo nero, alto, con 4 braccia." + (this.currentRoom.objects.piumino && this.currentRoom.objects.piumino.visible ? "\nIn uno di essi è appeso il mio piumino nero." : ""),
						on: {
							lookAt: () => this.discover(this.adventureData.objects.piumino)
						}
					},
					scrivania: {
						pattern: "scrivania",
						description: "E’ una scrivania rettangolare in legno chiaro. Sotto di essa c’è una cassettiera in ferro e il piccolo cestino dell’immondizia. Sopra di essa un'accozzaglia di appunti scritti su fogli e foglietti."
					},
					appunti: {
						pattern: `appunt(?:o|i)|fogli(?:o|i|etti)?`,
						description: () => this.playerHas(this.adventureData.objects.occhiali) ? "Sono parti di codice e diagrammi di flusso, qualche schema di caso di uso di un qualche software e una serie di numeri" : "E' tutta roba illeggibile.",
						on: {
							read: () => this.currentRoom.interactors.appunti.description()
						}
					},
					cassettiera: {
						pattern: "cassettiera((?: di)? ferro)?",
						spostabile: false,
						spostata: false,
						description: () => "E’ una cassettiera di ferro di colore grigio scuro, con la serratura nel primo cassetto e le ruote.",
						on: {
							'close|open': `Dovresti agire sui cassetti...`,
							"push|pull|move": async () => {
								let cassettiera = this.currentRoom.interactors.cassettiera;

								if(!cassettiera.spostabile)
									return "Non si muove, sembra incollata al pavimento!"
								if(cassettiera.spostata)
									return "Non voglio muoverla più!"
								cassettiera.spostata = true;
								this.discover(this.adventureData.objects.chiaveCassettiera)
								await this.CRT.printTyping("Con un rumoroso cigolio la cassettiera finalmente si è spostata...",{cr: false});
								await this.CRT.sleep(1500)
								return "sotto di essa c'è una piccola chiave!"
							},
							lift: () => "E' toppo pesante!"
						}
					},
					serratura: {
						pattern: "serratura",
						description: "E' la serratura della cassettiera. Serve per chiudere a chiave i cassetti."
					},
					cassetti: {
						pattern: "cassett(?:o|i)",
						chiusiAChiave: true,
						aperti: false,
						on: {
							open: () => {
								let cassetti = this.currentRoom.interactors.cassetti;
								if(cassetti.chiusiAChiave)
									return "Niente da fare, i cassetti sono chiusi a chiave."
								if(cassetti.aperti)
									return "I cassetti sono già aperti"
								this.discover(this.adventureData.objects.occhiali, true);
								cassetti.aperti = true;
								delete this.currentRoom.interactors.cianfrusaglie.visible
								return "Finalmente riesci ad aprire i cassetti. Da uno di essi tiri fuori un paio di occhiali e li appoggi sulla scrivania."
							},
							close: () => {
								if(this.currentRoom.interactors.cassetti.chiusiAChiave || this.currentRoom.interactors.cassetti.aperti == false)
									return "Più di così non posso!"
								
								this.currentRoom.interactors.cassetti.aperti = false
								this.currentRoom.interactors.cianfrusaglie.visible = false
								return "Richiudi delicatamente i cassetti."
							},
							lookAt: () => this.currentRoom.interactors.cassetti.aperti ? "Sono pieni di cianfrusaglie." : this.Thesaurus.defaultMessages.NOTHING_PARTICULAR,
							move: () => this.Thesaurus.defaultMessages.NOT_POSSIBLE
						}
					},
					cianfrusaglie: {
						pattern: `cianfrusaglie`,
						visible: false,
						on: {
							'push|pull|move|lift': () => this.Thesaurus.defaultMessages.PREFER_NOT 
						}
					},
					cavi:{
						sistemabili: false,
						sistemati: false,
						pattern: "cav(?:o|i)",
						description: () => this.playerHas(this.adventureData.objects.occhiali) ? "Sono cavi della corrente e cavi Ethernet..." : "Sono cavi bianchi e grigi...",
						on: {
							move: () => {

								let cavi = this.currentRoom.interactors.cavi;

								if(cavi.sistemabili == false)
									return "Perché dovrei?"
								if(cavi.sistemati)
									return "Meglio lasciarli in ordine!"
								cavi.sistemati = true;
								this.currentRoom.interactors.cassettiera.spostabile = true;
								return "Adesso si che si ragiona! Li ho sistemati in modo che non intralcino più!"
							},
							lift: () => {
								if(this.currentRoom.interactors.cavi.sistemabili == false)
									return "Perché dovrei?"
								return "Li sollevi per un po'... poi ti stanchi e li lasci ricadere ancora più in disordine di prima!"
							},
						}
					},
					pavimento: {
						...this.commonInteractors.floor,
						...{
							description: () => {
								this.currentRoom.interactors.cavi.sistemabili = true
								return "E' il classico pavimento flottante presente in quasi tutte le stanze del posto dove lavori... è grigio chiaro con striature più scure." + (this.currentRoom.interactors.cavi.sistemati == false ? "\nAccipicchia! vicino alla scrivania è tutto un groviglio di cavi!" : "");
							}
						}
					},
					soffitto: this.commonInteractors.ceiling,
					finestra: {
						pattern: `finestr(?:a|one)`,
						description: "Dalla finestra vedi il giardino e il parchegghio sottostante. Come al solito non ricordi dove hai messo la tua macchina!",
					},
					porta: {
						pattern: `porta`,
						aperta:false,
						description: "E' la porta del tuo ufficio. Non ha serrature, solo un pomolo. Accanto ad essa c'è un lettore badge con una pulsantiera.",
						on: {
							open: () => {
								return "Provi a tirare il pomolo della porta, ma è bloccata..."
							}
						}
					},
					lettoreBadge: {
						pattern: `lettore(?: badge)?`,
						description: `E' un lettore rfid, credo serva per aprire la porta col badge personale.`
					},
					pulsantiera: {
						pattern: `pulsanti(?:era)?`,
						description: `Nella pulsantiera ci sono solo numeri da 0 a 9.`,
						on: {
							'press|push': `Non saprei davvero cosa digitare...`
						},
					}

				},
				onEnter: async () => {
					if(this.adventureData.prologue){
						this.adventureData.prologue = false;
						await this.runSequence("prologo");
					} 
				},
			},

		},

		/* OGGETTI */
		objects: {

			chiaveCassettiera: {
				label: "una piccola chiave di ferro",
				pattern: "(?:piccola )?chiave((?: di)? ferro)?",
				location: "ufficio",
				visible: false,
				on: {
					useWith: (targets)=> {
						let i = this.currentRoom.interactors;
						if(targets[1] == i.cassettiera || targets[1] == i.cassetti || targets[1] == i.serratura){

							i.cassetti.chiusiAChiave = ! i.cassetti.chiusiAChiave
							return "-Click!-";
						}
						return null
					},
					putInto: (targets)=> {
						let i = this.currentRoom.interactors;
						if(targets[1] == i.serratura){

							i.cassetti.chiusiAChiave = ! i.cassetti.chiusiAChiave
							return "-Click!-";
						}
						return null
					}
				}
			},
			occhiali: {
				label: "un paio di occhiali",
				pattern: "(?:paio (?:di )?)?occhiali",
				description: () => (this.playerHas(this.adventureData.objects.occhiali) ? "Sono" : "Sembrano") + " occhiali per astigmatici e ipermetropi.",
				initialDescription: "Ci sono un paio di occhiali sulla scrivania.",
				location: "ufficio",
				visible:false,
				on: {
					take: () => {
						this._addInInventory(this.adventureData.objects.occhiali);
						return "Guardandoli da vicino ti accorgi che sono i tuoi occhiali da vista. Quindi gli indossi....\nOra è tutto MOLTO più chiaro e definito!"
					},
					drop: "Meglio di no, potrebbero servirti in furturo."
				}
			},
			piumino: {
				label: "un piumino nero",
				visible: false,
				pattern: "(piumino|giacc(?:a|etto))(?: ner(?:o|a))?",
				description: "E' un piumino leggero, primaverile. E' molto semplice. Ha quattro tasche, due interne e due esterne.",
				location: "ufficio",
				linkedObjects: ["taschePiumino"],
				on: {
					lookAt: () => this.discover(this.adventureData.objects.taschePiumino, true),
					drop: () => this.currentRoom == this.adventureData.rooms.ufficio ? `Lo rimetto nell'atttaccapanni.` : null
				}
			},

			taschePiumino: {
				visible: false,
				pattern: "tasc(?:a|he)",
				on: {
					'open|lookAt': () => {
						if(this.adventureData.objects.badge.visible)
							return "Dopo un'attenta ispezione concludi che sono tutte e quattro vuote."
						this.adventureData.objects.badge.location = this.currentRoom.key
						this.discover(this.adventureData.objects.badge)
						return "Da una di esse tiri fuori un oggetto rigido... E' il tuo badge personale!";
					}
				}
			},
			badge: {
				label: "un badge",
				visible: false,
				pattern: "badge",
				description: () =>  "Sopra c'è la tua foto e " + (this.playerHas(this.adventureData.objects.occhiali) ? "il numero del badge: 098074" : "un numero poco distinguibile...")
			},
			libro: {
				label: `un libro`,
				pattern: `libro`,
				visible: false,
				read: false,
				descriprion: () => `Ha una copertina grigia e un segnalibro all'interno.`,
				on: {
					'open|read': () => {
						if (this.playerHas(this.adventureData.objects.libro)){
							this.inventory.objects.libro.read = true;
							return "E' un libro di lettura, di Stephen King, dal titolo INSOMNIA. Apri il libro al segnalibro. E' una pagina bianca, si legge solo il titolo in alto e il numero di pagina in basso (1037)"
						}
						return "Dovrei prenderlo prima..." 
					}
				}
			}


		},

		/* SEQUENZE */
		sequenze:{
			titolo: async () => {
				this.CRT.clear();
				await this.CRT.sleep(1000);
				await this.CRT.println(i18n.title,{nlAfter:1});
				await this.CRT.wait();
				this.CRT.clear();
				
			},
			prologo: async () => {
				await this.CRT.sleep(1000);
				await this.CRT.printTyping("Accidenti che mal di testa....")
				await this.CRT.sleep(1500);
				await this.CRT.printTyping("Come ho fatto ad addormentarmi in ufficio?")
				await this.CRT.sleep(1000);
				await this.CRT.printTyping("E Quanto tempo è passato?")
				await this.CRT.sleep(1500);
				await this.CRT.printTyping("Uhm... ",{cr:false})
				await this.CRT.sleep(2000);
				await this.CRT.printTyping("E' tutto troppo silenzioso qui.");
				await this.CRT.sleep(1500);
				await this.CRT.printTyping("Sarà meglio tornare a casa.",{nlAfter:1})
				await this.CRT.sleep(2000);
			}
		}

	}

}
