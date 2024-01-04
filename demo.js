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
					e: () => this.currentRoom.interactors.porta.open ? this.enterRoom("quasiFuori") : `La porta dell'ufficio è chiusa.`
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
							description: async () => {
								await this.CRT.printTyping("Nella parete di fronte, c'è il modile a vetri, in quella a est c'è la porta di ingresso. Nella parete opposta alla porta c'è l'unica finestra della stanza.\nLa parete dietro di te è completamente spoglia, a parte "+(this.playerHas(this.adventureData.objects.occhiali) ? "": "(credo) ")+ "un calendario appeso.");
								if( this.currentRoom.interactors.attaccapanni.visible == false){
									await this.CRT.sleep(1500);
									await this.CRT.printTyping(`Di fianco al mobile c'è un attaccapanni, mica l'avevo notato prima!`)
									await this.discover(this.currentRoom.interactors.attaccapanni)
								}
							},
							on: {
								lookAt: () => this.currentRoom.interactors.pareti.description()
							}
						}
					},
					mobile: {
						pattern: "mobile",
						open:false,
						description: () => `E' un massicico mobile di legno con le ante di vetro scuro.` + (this.currentRoom.interactors.mobile.open ? `All'interno il mobile è ricolmo di libri` : `\nRiesco ad intravedere qualcosa al suo interno...`),
						on: {
							lookAt: () => this.currentRoom.interactors.mobile.description(),
							open: () => this.currentRoom.interactors.ante.on.open(),
							close: () => this.currentRoom.interactors.ante.on.close()
						}
					},
					riflesso: {
						pattern: `riflesso`,
						description: `Non hai una bella cera...`
					},
					ante: {
						pattern: `ant(?:a|e)`,
						description: "Le ante del mobile sono in vetro scuro e spesso. Sono pure discretamente riflettenti.",
						on: {
							open: () => {
								if(this.currentRoom.interactors.mobile.open)
									return `Le ante sono già aperte.`
								this.currentRoom.interactors.mobile.open = true;
								if(this.currentRoom.interactors.libri.visible == false){
									this.discover(this.currentRoom.interactors.libri,true)
									return `Il mobile è pieno zeppo di libri.`
								}
								return this.Thesaurus.defaultMessages.DONE
							},
							close: () => {
								if(this.currentRoom.interactors.mobile.open == false)
									return `Le ante sono già chiuse.`
								this.currentRoom.interactors.mobile.open = false;
								return this.Thesaurus.defaultMessages.DONE
							}
						}
					},
					libri: {
						label: 'alcuni libri',
						pattern: `libri`,
						visible: false,
						description: () => this.currentRoom.interactors.mobile.open ? (this.playerHas(this.adventureData.objects.occhiali) ? `Sono tutti libri di programmazione: PHP, JAVA, PYTHON...` + (this.adventureData.objects.libro.visible ? `C'è nè uno diverso dagli altri...` : ``) : `Sulle costole dei libri ci sono scritti i vari titoli, purtroppo senza occhiali non riesco a distinguere bene i caratteri...`) : `Forse dovrei aprire le ante per esaminarli meglio`,
						on: {
							'lookAt|read|open': () => this.discover(this.adventureData.objects.libro, !this.playerHas(this.adventureData.objects.occhiali))
						}
					},
					calendario: {
						pattern: "calendario",
						read: false,
						description: () => "E' un calendario vecchio, del 1979." + (this.playerHas(this.adventureData.objects.occhiali) ? " Attualmente mostra il mese di ottobre. Il giorno 18 è cerchiato in rosso." : "")
					},
					attaccapanni: {
						label: "un attaccapanni",
						pattern: "attaccapanni|appendiabiti",
						visible: false,
						description: () => "E' di metallo nero, alto, con 4 braccia." + (this.currentRoom.objects.piumino && this.currentRoom.objects.piumino.visible ? "\nIn uno di essi è appeso un piumino nero." : ""),
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
						status: 0,
						description: () => "E’ una cassettiera di ferro di colore grigio scuro, con la serratura nel primo cassetto e le ruote.",
						on: {
							'close|open': `Dovresti agire sui cassetti...`,
							"push|pull|move": async () => {
								let cassettiera = this.currentRoom.interactors.cassettiera;

								if(cassettiera.status == 0)
									return "Non si muove, sembra incollata a terra!"
								if(cassettiera.status == 2)
									return "Non voglio muoverla più!"
								cassettiera.status = 2;
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
						locked: true,
						attempt: 0,
						open: false,
						on: {
							open: () => {
								let cassetti = this.currentRoom.interactors.cassetti;
								if(cassetti.locked){
									if(cassetti.attempt == 0) cassetti.attempt += 1;
									return "Niente da fare, i cassetti sono chiusi a chiave."
								}
								if(cassetti.open)
									return "I cassetti sono già aperti"
								
								cassetti.open = true;
								let finalmente = (cassetti.attempt > 3 ? "finalmente ":"")

								let occhiali = this.adventureData.objects.occhiali.visible == false ? `\nIn uno di essi noti un paio di occhiali, quindi li tiri fuori e li appoggi sulla scrivania...` : ``
								
								this.discover(this.adventureData.objects.occhiali, true);
								this.discover(this.currentRoom.interactors.cianfrusaglie, true);
								
								cassetti.attempt = -1
								
								return `Hai ${finalmente}aperto i cassetti.${occhiali}`
							},
							close: () => {
								if(this.currentRoom.interactors.cassetti.locked || this.currentRoom.interactors.cassetti.open == false)
									return "Più di così non posso!"
								
								this.currentRoom.interactors.cassetti.open = false
								this.currentRoom.interactors.cianfrusaglie.visible = false
								return "Richiudi delicatamente i cassetti."
							},
							lookAt: () => this.currentRoom.interactors.cassetti.open ? "Sono pieni di cianfrusaglie." : this.Thesaurus.defaultMessages.NOTHING_PARTICULAR,
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
					cestino: {
						pattern: `cestino|spazzatura`,
						description: `E' un cestino di plastica nera, completamente vuoto.`
					},
					cavi:{
						status: 0,
						pattern: "cav(?:o|i)",
						description: () => this.playerHas(this.adventureData.objects.occhiali) ? "Sono cavi della corrente e cavi Ethernet..." : "Sono cavi bianchi e grigi...",
						on: {
							move: () => {

								let cavi = this.currentRoom.interactors.cavi;

								if(cavi.status == 0)
									return "Perché dovrei?"
								if(cavi.status == 2)
									return "Meglio lasciarli in ordine!"
								cavi.status = 2;
								this.currentRoom.interactors.cassettiera.status = 1;
								return "Adesso si che si ragiona! Li ho sistemati in modo che non intralcino più!"
							},
							lift: () => {
								if(this.currentRoom.interactors.cavi.status == 0)
									return "Perché dovrei?"
								return "Li sollevi per un po'... poi ti stanchi e li lasci ricadere ancora più in disordine di prima!"
							},
						}
					},
					pavimento: {
						...this.commonInteractors.floor,
						...{
							description: () => {
								if(this.currentRoom.interactors.cavi.status == 0)
									this.currentRoom.interactors.cavi.status = 1
								return "E' il classico pavimento flottante presente in quasi tutte le stanze del posto dove lavori... è grigio chiaro con striature più scure." + (this.currentRoom.interactors.cavi.status == 1 ? "\nAccipicchia! vicino alla scrivania è tutto un groviglio di cavi!" : "");
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
						locked:true,
						open:false,
						description: "E' la porta del tuo ufficio. Non ha serrature, solo un pomolo. Accanto ad essa c'è un lettore badge con una pulsantiera.",
						on: {
							lookAt: () => this.discover(this.currentRoom.interactors.lettoreBadge),
							open: () => {
								let porta = this.currentRoom.interactors.porta;

								if(porta.locked) 
									return "Provi a tirare il pomolo della porta, ma è bloccata..."
								if(porta.open)
									return `La porta è già aperta`
								porta.open = true
								return `La porta è aperta adesso.`

							},
							close: () => {
								let porta = this.currentRoom.interactors.porta;

								if(porta.locked || porta.open == false) {
									return "La porta è già chiusa"
								}
								porta.locked = true;
								porta.open = false
								return `La porta è chiusa adesso.`
							}
						}
					},
					pomolo: {
						pattern:`pom(?:olo|ello)`,
						on:{
							pull: () => this.currentRoom.interactors.porta.on.open(),
							push: () => this.currentRoom.interactors.porta.on.close()
						}
					},
					lettoreBadge: {
						pattern: `lettore(?: badge)?`,
						description: () => this.currentRoom.interactors.lettoreBadge.visible ? `E' un lettore rfid, credo serva per aprire la porta col badge personale.` : `Mi sembrava di averne visto uno... ma dove?`
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
				onExit: async () => {
					await this.runSequence("crollo");
				}
			},
			quasiFuori: {
				label: "Quasi fuori",
				description: `Sei al piano terra dell'edificio, in una stanza quadrata. Le scale che ti hanno portato qui sono crollate. Davanti a te c'è il grosso portone a vetri dal quale riesci a vedere l'esterno!`,
				interactors: {
					portone: {
						pattern: `port(?:a|one)`,
						description: `E' un portone a vetri, probabilmente blindato. Accanto ad esso c'è un display con una pulsantiera sotto.`
					},
					display: {
						pattern: `display|schermo`,
						on: {
							'lookAt|read': async () => {
								if(!this.playerHas(this.adventureData.objects.occhiali))
									return "Non riesco a leggerlo, senza occhiali!"

								if(await this.yesNoQuestion("Chiede un codice di sicurezza per uscire... vuoi provare a digitarlo") == false)
									return true;

								let pin = await this.ask("PIN:",true)

							}
						}
					},
					pulsantiera: {
						pattern: `pulsanti(?:era)?`,
						description: `Nella pulsantiera ci sono solo numeri da 0 a 9.`,
						on: {
							'press|push': `Non saprei davvero cosa digitare...`
						},
					}
				}
			}

		},

		/* OGGETTI */
		objects: {

			chiaveCassettiera: {
				label: "una piccola chiave di ferro",
				pattern: "(?:piccola )?chiave((?: di)? ferro)?",
				location: "ufficio",
				visible: false,
				on: {
					'useWith|putInto': async (targets) => {
						let i = this.currentRoom.interactors;
						if(targets[1] == i.cassettiera){
							return this.Thesaurus.defaultMessages.BE_MORE_SPECIFIC
						}
						if(targets[1] == i.cassetti || targets[1] == i.serratura){
							if(i.cassetti.open){
								await this.CRT.printTyping("Prima chiudo i cassetti...");
								await this.CRT.sleep(1000)
							}
							i.cassetti.locked = ! i.cassetti.locked
							return "La serratura della cassettiera ha fatto -Click!-";
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
					'take|wear': () => {
						this._addInInventory(this.adventureData.objects.occhiali);
						return "Guardandoli da vicino ti accorgi che sono i tuoi occhiali da vista. Quindi li indossi....\nOra è tutto MOLTO più chiaro e definito!"
					},
					drop: "Meglio di no, potrebbero servirti in furturo."
				}
			},
			piumino: {
				label: "un piumino nero",
				visible: false,
				pattern: "(piumino|giacc(?:a|etto))(?: ner(?:o|a))?",
				description: () => "E' un piumino nero"+ (this.playerHas(this.adventureData.objects.occhiali) == false ? ". Sembra":"")+" leggero, primaverile."+ ((this.adventureData.objects.taschePiumino.visible === undefined) ? "\nHa quattro tasche, due interne e due esterne.":""),
				location: "ufficio",
				linkedObjects: ["taschePiumino"],
				on: {
					lookAt: () => {
						if (this.playerHas(this.adventureData.objects.piumino)) 
							this.discover(this.adventureData.objects.taschePiumino, true)
						return null
					},
					wear: async (targets) => await this._take(targets[0]),
					drop: async () => {
						if (this.currentRoom == this.adventureData.rooms.ufficio) 
							await this.CRT.printTyping(`Lo rimetto nell'attaccapanni...`, {cr: false})
						return null
					}
				}
			},

			taschePiumino: {
				visible: false,
				pattern: "tasc(?:a|he)",
				on: {
					'open|lookAt': () => {
						let objects = this.adventureData.objects;
						if(objects.badge.visible)
							return "Dopo un'attenta ispezione concludi che sono tutte e quattro vuote."
						objects.badge.location = this.currentRoom.key
						if(this.playerHas(objects.piumino)){
							this._addInInventory(objects.badge)
						} else {
							this.discover(objects.badge)
						}
						return "Da una di esse estrai un oggetto rigido... E' il tuo badge personale!";
					}
				}
			},
			badge: {
				label: "un badge",
				visible: false,
				pattern: "badge",
				description: () =>  "Sopra c'è la tua foto e " + (this.playerHas(this.adventureData.objects.occhiali) ? "il numero del badge: 098074" : "un numero poco distinguibile..."),
				on: {
					'useWith|bringCloser': async (mSubjects) => {
						let i = this.currentRoom.interactors
						let o = this.currentRoom.objects
						if(mSubjects[1] == i.lettoreBadge){
							if (i.lettoreBadge.visible == false)
								return i.lettoreBadge.description()

							i.porta.locked = false;
							await this.CRT.printTyping("Avvicini il badge al lettore e...",{printDelay: 75, cr: false});
							await this.CRT.sleep(1000);
							await this.CRT.printTyping("Bzzzzzzz...");
							await this.CRT.sleep(1500);
							return `La porta ha vibrato per qualche secondo...`
						}
						return null
					}
				}
			},
			libro: {
				label: `un libro`,
				pattern: `libro`,
				location: `ufficio`,
				read: false,
				visible: false,
				description: () => this.adventureData.objects.libro.visible ? `Ha una copertina grigia e un segnalibro all'interno.` : `Non saprei quale scegliere.`,
				on: {
					'open|read': () => {

						if (this.playerHas(this.adventureData.objects.libro)){
							this.inventory.libro.read = true;
							return "E' un libro di lettura, di Stephen King, dal titolo INSOMNIA. Apri il libro al segnalibro. E' una pagina bianca, si legge solo il titolo in alto e il numero di pagina in basso (1037)"
						}
						return this.adventureData.objects.libro.visible ? "Dovrei prenderlo prima..." : this.adventureData.objects.libro.description()
					},
					take: () => this.adventureData.objects.libro.visible ? null : this.adventureData.objects.libro.description()
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
			},
			crollo: async () => {
				await this.CRT.printTyping("Appena esci dall'ufficio la porta dietro di te si richiude pesantamente!")
				await this.CRT.sleep(1500);
				await this.CRT.printTyping("Non vedi l'ora di tornare a casa. Il tuo ufficio è così claustrofobico e opprimente... Per fortuna adesso sei fuori da lì.")
				await this.CRT.sleep(2000);
				await this.CRT.printTyping("Percorri con passo svelto il corridoio che ti porta alle scale. Quindi inizi a scenderle, d'apprima piano, poi sempre più rapidamente...")
				await this.CRT.sleep(2500);
				await this.CRT.printTyping("Finalmente sei in fondo alle scale!",{cr:false})
				await this.CRT.sleep(1500);
				await this.CRT.printTyping(" Improvvisamente però... ",{printTyping:75, cr:false});
				await this.CRT.sleep(1500);
				await this.CRT.printTyping("BOOM!")
				await this.CRT.sleep(2000);
				await this.CRT.printTyping("Prima senti un'esplosione...",{printTyping:75, cr:false})
				await this.CRT.sleep(1000);
				await this.CRT.printTyping(" poi la terra inizia a tremare!", {printTyping:75})
				await this.CRT.sleep(2000);
				await this.CRT.printTyping("Cerchi riparo invano mentre le scale dietro di te crollano...",{nlAfter: 1})
				await this.CRT.sleep(3000);
			}
		}

	}

}
