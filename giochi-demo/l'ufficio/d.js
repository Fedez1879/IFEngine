class Adventure extends DemoEngine{
	adventureData = {
		// prologo
		prologue: true,
		
		/* STANZE */
		rooms: {

			ufficio: {
				label: `Ufficio`,
				description: () => {
					return `Sei nel tuo ufficio. La scrivania è come sempre piena di appunti. Di fronte a te, le ante vetrate del mobile riflettono il tuo viso pallido. Dalla finestra a ovest entra una fioca luce arancione.`
				},
				directions: {
					e: () => this.currentRoom.interactors.porta.open ? this.enterRoom(`quasiFuori`) : `La porta dell'ufficio è chiusa.`
				},
				override: {
					commands: {
						exit: async() => this.currentRoom.interactors.porta.open ? this.stringOrFalse(this.currentRoom.directions.e()) : this.Thesaurus.commands.exit.defaultMessage
					}
				},
				scenic: {
					pattern: [`chiodo`, `ruot(?:a|e)`, `viso`, `riflesso`, `ganci(?:o)?`, `vetro`,`macchin(?:a|e)|auto(?:mobil(e|i)?)?`],
					defaultMessage: `Lascia perdere, concentrati piuttosto su come trovare il modo di uscire da qui..`
				},
				interactors: {
					fuori: {
						...this.commonInteractors.outside, 
						...{
							on: {
								lookAt: () => this.currentRoom.interactors.finestra.description
							}
						}
					},
					ufficio: {
						pattern: `ufficio`,
						description: () => this.currentRoom.description()
					},
					luce: {
						pattern: `(?:fioca|debole|flebile )?luce`,
						description: `E' la flebile luce del tramonto.`
					},
					pareti: {
						...this.commonInteractors.wall,
						...{
							description: async () => {
								await this.CRT.printTyping(`Nella parete di fronte, c'è il mobile a vetri, in quella a est c'è la porta di ingresso. Nella parete opposta alla porta c'è l'unica finestra della stanza.\nLa parete dietro di te è completamente spoglia, a parte `+(this.playerHas(this.adventureData.objects.occhiali) ? ``: `(credo) `)+ `un calendario appeso a un chiodo.`);
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
					sedia: {
						pattern: `sedia`,
						description: `E' la classica sedia da ufficio con ruote, regolabile in altezza e girevole. Ha sicuramente visto giorni migliori.`
					},
					mobile: {
						pattern: `(?:moderno )?mobile`,
						open:false,
						description: () => `E' un massicico mobile di legno con le ante di vetro scuro.\n` + (this.currentRoom.interactors.mobile.open ? `All'interno il mobile è ricolmo di libri.` : `Riesco ad intravedere qualcosa al suo interno...`),
						on: {
							lookAt: () => this.currentRoom.interactors.mobile.description(),
							open: () => this.currentRoom.interactors.ante.on.open(),
							close: () => this.currentRoom.interactors.ante.on.close()
						}
					},
					riflesso: {
						pattern: `riflesso`,
						description: `Non hai una bella cera.`
					},
					ante: {
						pattern: `ant(?:a|e)`,
						description: `Le ante del mobile sono in vetro scuro e spesso. Sono pure discretamente riflettenti.`,
						on: {
							open: () => {
								if(this.currentRoom.interactors.mobile.open)
									return `Le ante sono già aperte.`
								this.currentRoom.interactors.mobile.open = true;
								
								if(this.currentRoom.interactors.libri.visible == false){
									this.discover(this.currentRoom.interactors.libri,true)
									return `Il mobile è pieno zeppo di libri.`
								} 
								
								if(this.currentRoom.objects.libro && this.currentRoom.objects.libro.visible == false)
									this.currentRoom.objects.libro.visible = true
								
								return this.Thesaurus.defaultMessages.DONE
							},
							close: () => {
								if(this.currentRoom.interactors.mobile.open == false)
									return `Le ante sono già chiuse.`
								this.currentRoom.interactors.mobile.open = false;
								if(this.currentRoom.key == "ufficio" && this.currentRoom.objects.libro)
									this.currentRoom.objects.libro.visible = false
								return this.Thesaurus.defaultMessages.DONE
							}
						}
					},
					libri: {
						label: 'alcuni libri',
						pattern: `(?:costole )?(?:di )?libri`,
						visible: false,
						description: () => this.currentRoom.interactors.mobile.open ? (this.playerHas(this.adventureData.objects.occhiali) ? `Sono tutti libri di programmazione: PHP, JAVA, PYTHON...` + (this.adventureData.objects.libro.visible && this.playerHas(this.adventureData.objects.libro) == false ? `C'è nè uno diverso dagli altri.` : ``) : `Sulle costole dei libri ci sono scritti i vari titoli, purtroppo senza occhiali non riesco a distinguere bene i caratteri.`) : `Forse dovrei aprire le ante per esaminarli meglio.`,
						on: {
							'lookAt|read|open': () => this.discover(this.adventureData.objects.libro, !this.playerHas(this.adventureData.objects.occhiali))
						}
					},
					calendario: {
						pattern: `calendario`,
						read: false,
						description: () => `E' un calendario a parete, di quelli con le figure in alto e le caselle con i numeri in basso.` + (this.playerHas(this.adventureData.objects.occhiali) ? ` E' del 1979. E' aperto al mese di ottobre e c'è un giorno cerchiato in rosso: il 18.` : ``),
						on: {
							lookAt: () => {
								if (this.playerHas(this.adventureData.objects.occhiali))
									this.currentRoom.interactors.calendario.read = true
								return null
							},
							'move|lift': `Sposti il calendario per vedere se c'è qualcosa dietro, ma non noti nulla di particolare. Quindi lo rimetti a posto.`
						}

					},
					attaccapanni: {
						label: `un attaccapanni`,
						pattern: `attacca(?:\s+)?panni|appendi(?:\s+)?abiti`,
						visible: false,
						description: () => `E' di metallo nero, alto, con quattro ganci.` + (this.currentRoom.objects.piumino && this.currentRoom.objects.piumino.visible ? `\nIn uno di essi è appeso un piumino nero.` : ``),
						on: {
							lookAt: () => this.discover(this.adventureData.objects.piumino)
						}
					},
					scrivania: {
						pattern: `scrivania`,
						description: () => `E’ una scrivania rettangolare in legno chiaro. Sotto di essa c’è una cassettiera in ferro e il piccolo cestino dell’immondizia. Sulla scrivania sono sparsi un'accozzaglia di appunti scritti su fogli e foglietti.` + (this.adventureData.objects.occhiali.visible === undefined && this.playerHas(this.adventureData.objects.occhiali) == false ? `\n`+this.adventureData.objects.occhiali.initialDescription : ``)
					},
					appunti: {
						pattern: `appunt(?:o|i)|fogli(?:o|i|etti)?`,
						description: () => this.playerHas(this.adventureData.objects.occhiali) ? `Sono parti di codice, diagrammi di flusso e schemi di casi d'uso di un qualche software, presumibilmente scritto da me.` : `E' tutta roba illeggibile.`,
						on: {
							'lookAt|read': () => {
								if(this.playerHas(this.adventureData.objects.occhiali))
									this.discover(this.currentRoom.interactors.scritteAppunti, true);
								return this.currentRoom.interactors.appunti.description()
							},
							'move|lift': () => `Non c'è niente sotto.`,
							'open|close': () => this.Thesaurus.defaultMessages.BE_SERIOUS
						}
					},
					scritteAppunti: {
						visible:false,
						pattern: `codice|diagramm(?:a|i)|schem(?:a|i)`,
						description: `Non ci pensi nemmeno... ora hai solo voglia di tornare a casa!`,
						on: {
							read: () => this.currentRoom.interactors.appunti.description(),
							'move|lift|open|close': () => this.Thesaurus.defaultMessages.BE_SERIOUS
						}

					},
					cassettiera: {
						pattern: `cassettiera((?: di)? ferro)?`,
						status: 0,
						description: () => `E’ una cassettiera di ferro con ruote, è di colore grigio scuro e ha tre cassetti. In cima alla cassettiera c'è una serratura.`,
						on: {
							'close|open': `Dovresti agire sui cassetti...`,
							'push|pull|move': async () => {
								let cassettiera = this.currentRoom.interactors.cassettiera;

								if(cassettiera.status == 0)
									return `Non si muove, sembra incollata a terra!`
								if(cassettiera.status == 2)
									return `Non hai più intenzione di muoverla!`
								cassettiera.status = 2;
								this.discover(this.adventureData.objects.chiaveCassettiera)
								await this.CRT.printTyping(`Con un rumoroso cigolio la cassettiera finalmente si è spostata...`);
								return `Sotto di essa c'è una piccola chiave!`
							},
							lift: () => `E' toppo pesante!`
						}
					},
					serratura: {
						pattern: `serratura`,
						description: `E' la serratura della cassettiera. Serve per chiudere a chiave i cassetti.`
					},
					cassetti: {
						pattern: `((?:primo |secondo |terzo )?cassetto|cassetti)`,
						locked: true,
						attempt: 0,
						open: false,
						on: {
							open: () => {
								let cassetti = this.currentRoom.interactors.cassetti;
								if(cassetti.locked){
									if(cassetti.attempt == 0) cassetti.attempt += 1;
									return `Niente da fare, i cassetti sono chiusi a chiave.`
								}
								if(cassetti.open)
									return `I cassetti sono già aperti`
								
								cassetti.open = true;
								let finalmente = (cassetti.attempt > 3 ? `finalmente `:``)

								let occhiali = this.adventureData.objects.occhiali.visible == false ? `\nIn uno di essi noti un paio di occhiali, quindi li tiri fuori e li appoggi sulla scrivania...` : ``
								
								this.discover(this.adventureData.objects.occhiali, true);
								this.discover(this.currentRoom.interactors.cianfrusaglie, true);
								
								cassetti.attempt = -1
								
								return `Non ti limiti ad un solo cassetto, ma ${finalmente}li apri tutti quanti.${occhiali}`
							},
							close: () => {
								if(this.currentRoom.interactors.cassetti.locked || this.currentRoom.interactors.cassetti.open == false)
									return `Più di così non puoi!`
								
								this.currentRoom.interactors.cassetti.open = false
								this.currentRoom.interactors.cianfrusaglie.visible = false
								return `Richiudi delicatamente tutti cassetti.`
							},
							lookAt: () => this.currentRoom.interactors.cassetti.open ? `Ispezioni con cura tutti i cassetti, ma sono solo pieni di cianfrusaglie.` : this.Thesaurus.defaultMessages.NOTHING_PARTICULAR,
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
						description: `E' un cestino di plastica nera, completamente vuoto.`,
						on: {
							'move|lift': `Sposti il cestino per vedere se c'è qualcosa sotto, ma non noti nulla di particolare.`
						}
					},
					cavi:{
						status: 0,
						pattern: `cav(?:o|i)`,
						description: () => this.playerHas(this.adventureData.objects.occhiali) ? `Sono cavi della corrente e cavi Ethernet.` : `Sono cavi bianchi e grigi.`,
						on: {
							'move|tidy': () => {

								let cavi = this.currentRoom.interactors.cavi;

								if(cavi.status == 0)
									return `Perché dovrei?`
								if(cavi.status == 2)
									return `Sono già in ordine, meglio lasciarli stare.`
								cavi.status = 2;
								this.currentRoom.interactors.cassettiera.status = 1;
								return `Adesso si che si ragiona, li hai sistemati in modo che non intralcino più!`
							},
							lift: async () => {
								if(this.currentRoom.interactors.cavi.status == 0)
									return `Perché dovrei?`
								await this.CRT.printTyping(`Li sollevi per un po'... `,{cr:false,waitAfter:2000});
								return `poi ti stanchi e li lasci ricadere ancora più in disordine di prima!`
							},
						}
					},
					pavimento: {
						...this.commonInteractors.floor,
						...{
							description: () => {
								if(this.currentRoom.interactors.cavi.status == 0)
									this.currentRoom.interactors.cavi.status = 1
								return `E' il classico pavimento flottante presente in quasi tutte le stanze del posto dove lavori, è grigio chiaro con striature più scure.` + (this.currentRoom.interactors.cavi.status == 1 ? `\nAccipicchia! Vicino alla scrivania è tutto un groviglio di cavi!` : ``);
							}
						}
					},
					striature: {
						pattern: `striature`,
						description: `Sono irregolari e di colore grigio scuro.`,
						on: {
							'lift|move|read|open|close|push|pull|press': this.Thesaurus.defaultMessages.BE_SERIOUS
						}
					},
					soffitto: {
						...this.commonInteractors.ceiling,
						...{
							description: `sul soffitto ci sono quattro lampade a neon.`
						}
					},
					lampade: {
						pattern: `lampad(?:a|e)|neon`,
						on: {
							turnOn: `C'è ancora luce, meglio lasciarle spente!`,
							turnOff: `Sono già spente.`,
							'lift|move|read|open|close|push|pull|press': this.Thesaurus.defaultMessages.BE_SERIOUS
						}
					},
					finestra: {
						pattern: `finestr(?:a|one)`,
						description: `Dalla finestra vedi il giardino e il parcheggio sottostante. Come sempre, non ricordi dove hai messo la tua macchina!`,
					},
					parcheggio: {
						pattern: `parcheggio`,
						description: `Il parcheggio è quasi vuoto.`,
						on: {
							'lift|move|read|open|close|push|pull|press': this.Thesaurus.defaultMessages.BE_SERIOUS
						}
					},
					porta: {
						pattern: `porta`,
						locked:true,
						open:false,
						description: `E' la porta del tuo ufficio. Non ha serrature, solo un pomolo. Accanto ad essa c'è un lettore badge.`,
						on: {
							lookAt: () => this.discover(this.currentRoom.interactors.lettoreBadge),
							open: () => {
								let porta = this.currentRoom.interactors.porta;

								if(porta.locked) 
									return `Provi a tirare il pomolo della porta, ma non si apre. Sembra bloccata...`
								if(porta.open)
									return `La porta è già aperta`
								porta.open = true
								return `La porta è aperta adesso.`

							},
							close: () => {
								let porta = this.currentRoom.interactors.porta;

								if(porta.locked || porta.open == false) {
									return `La porta è già chiusa`
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
						label: 'un lettore badge',
						pattern: `lettore(?: badge)?`,
						description: () => this.currentRoom.interactors.lettoreBadge.visible ? `E' un lettore RFID, credo serva per aprire la porta col badge personale.` : `Mi sembrava di aver visto un lettore badge... ma dove?`
					}
				},
				onEnter: async () => {
					if(this.adventureData.prologue){
						this.adventureData.prologue = false;
						await this.runSequence(`prologo`);
					} 
					this.startTimedEvent(`earthquake`)
				},
				onExit: async () => {
					let occhiali = this.adventureData.objects.occhiali;
					if(this.playerHas(this.adventureData.objects.occhiali)){
						occhiali.visible = false
						this._removeFromInventory(occhiali,`quasiFuori`)
					}
					await this.runSequence(`crollo`);
				}
			},
			quasiFuori: {
				label: `Quasi fuori`,
				description: `Sei al piano terra dell'edificio, in una stanza quadrata. Le scale che ti hanno portato qui sono crollate. Davanti a te c'è il grosso portone a vetri dal quale riesci a intravedere l'esterno, sebbene stia facendo buio.`,
				directions: {
					u: () =>this.currentRoom.interactors.scale.description,
					d: () =>this.currentRoom.interactors.scale.description
				},
				override: {
					commands: {
						exit: async () => this.currentRoom.interactors.portone.locked ? this.Thesaurus.commands.exit.defaultMessage : this.stringOrFalse(this.currentRoom.interactors.portone.on.open())
					}
				},
				interactors: {
					fuori: {
						...this.commonInteractors.outside, 
						...{
							on: {
								lookAt: `Sta venendo buio in fretta.`
							}
						}
					},
					portone: {
						pattern: `port(?:a|one)`,
						locked: true,
						description: `E' un portone a vetri, probabilmente blindato. Accanto ad esso c'è un piccolo display.`,
						on: {
							open: () => {
								if(this.currentRoom.interactors.portone.locked)
									return `Il portone è bloccato, non riesco ad aprirlo!`
								return this.runSequence(`finale`);
							},
							close: () => `E' già chiuso!`
						}
					},
					display: {
						pattern: `display|schermo`,
						enabled: false,
						on: {
							'lookAt|read': async () => {
								if(this.currentRoom.interactors.display.enabled == false){
									return `E' spento.`;
								}
								console.log("?")
								if(!this.playerHas(this.adventureData.objects.occhiali))
									return `Non riesci a leggerlo, senza occhiali!` + (this.adventureData.objects.occhiali.once ? `\nDevi averli persi durante il crollo...` : ``)

								await this.CRT.printTyping(`Chiede un codice di sicurezza per aprire il portone...`,{cr:false,waitAfter:1500})

								if(this.maybeIKnowTheCode() == false)
									return ` ma tu non hai idea di quale possa essere!!!`
								
								let pin = await this.ask(`\nPIN:`,true)
								await this.CRT.sleep(1500)
								if(pin != `791018`){
									await this.CRT.println(`* CODICE ERRATO *`)
									return true
								}
								this.currentRoom.interactors.portone.locked = false 
								return `Il portone ha fatto -Click-`
							},
							'touch|push|press': async () => {
								if(this.currentRoom.interactors.display.enabled == false){

									this.currentRoom.interactors.display.enabled = true;
									await this.CRT.printTyping(`Il display si è acceso...`,{waitAfter: 1000})
								}
								return this.currentRoom.interactors.display.on['lookAt|read']();
							},
							turnOn: () => this.currentRoom.interactors.display.enabled ? `E' già acceso.` : `Ci deve essere un modo per accenderlo... devo solo capire come.`
						}
					},
					pareti: {
						...this.commonInteractors.wall,
						...{
							description: `Per ora hanno retto i colpi...`
						}
					},
					soffitto: {
						...this.commonInteractors.ceiling,
						...{
							description: `Mostra alcune crepe... ma è ancora al suo posto.`
						}
					},
					pavimento: {
						...this.commonInteractors.floor,
						...{
							description: () => `Il pavimento sembra ok.` + (this.playerHas(this.adventureData.objects.occhiali) == false && this.adventureData.objects.occhiali.location == this.currentRoom.key ? ` Ehi, ti pare di vedere degli occhiali per terra!` : ``),
							on: {
								lookAt: () => this.discover(this.adventureData.objects.occhiali, true)
							}
						}
					},
					scale: {
						pattern: `(?:rampa (?:di )?)?scal(a|e|ini)`,
						description: `Ormai le scale sono ridotte a un cumulo di macerie invalicabili.`
					},
					macerie: {
						pattern: `cumul(?:o|i)|maceri(?:a|e)|detrit(?:o|i)`,
						description: `Ciò che vedi è desolante, ma ti ricorda anche che devi brigarmi ad uscire!`,
						on: {
							'lift|move|read|open|close|push|pull|press': this.Thesaurus.defaultMessages.BE_SERIOUS
						}
					}

				},

			}

		},

		/* OGGETTI */
		objects: {

			chiaveCassettiera: {
				label: `una piccola chiave di ferro`,
				pattern: `(?:piccola )?chiave((?: di)? ferro)?`,
				description: `E' una piccola chiave di ferro con la testa in plastica nera.`,
				location: `ufficio`,
				visible: false,
				on: {
					'useWith|putInto': async (targets) => {
						let i = this.currentRoom.interactors;
						if(targets[1] == i.cassettiera || targets[1] == i.cassetti){
							return `Forse intendi la serratura della cassettiera?`
						}
						if(targets[1] == i.cassetti || targets[1] == i.serratura){
							if(i.cassetti.open){
								i.cassetti.open = false
								await this.CRT.printTyping(`Prima chiudo i cassetti...`);
								await this.CRT.sleep(1000)
							}
							i.cassetti.locked = ! i.cassetti.locked
							return `La serratura della cassettiera ha fatto -Click!-`;
						}
						return null
					}
				}
			},
			occhiali: {
				label: `un paio di occhiali`,
				pattern: `(?:paio (?:di )?)?occhiali`,
				description: () => (this.playerHas(this.adventureData.objects.occhiali) ? `Sono` : `Sembrano`) + ` occhiali per astigmatici e ipermetropi.`,
				initialDescription: `Ci sono un paio di occhiali sulla scrivania.`,
				location: `ufficio`,
				visible: false,
				once: false,
				worn: false,
				on: {
					take: () => {
						let occhiali = this.adventureData.objects.occhiali
						let answer;
						if(occhiali.once == false) {
							occhiali.once = true;
							answer = `Guardandoli da vicino ti accorgi che sono i tuoi occhiali da vista. Quindi li indossi...\nOra è tutto MOLTO più chiaro e definito!`
						} else {
							answer = `Sono proprio i tuoi occhiali, per fortuna li hai ritrovati! Li indossi nuovamente.`
						}

						this._addInInventory(occhiali);
						return this.wear(occhiali.key, answer);
					},
					wear: () => {
						if(!this.playerHas(this.adventureData.objects.occhiali))
							return this.adventureData.objects.occhiali.on.take()
						return `Sono già sul tuo naso!`
					},
					takeOff: () => this.inventory.occhiali.on.drop,
					drop: `Meglio di no, non ci vedi molto bene senza!`
				}
			},
			piumino: {
				label: `un piumino nero`,
				pattern: `(piumino|giacc(?:a|etto))(?: ner(?:o|a))?`,
				description: () => `E' un piumino nero`+ (this.playerHas(this.adventureData.objects.occhiali) == false ? `. Sembra`:``)+` leggero, primaverile.`+ ((this.adventureData.objects.taschePiumino.visible === undefined) ? `\nHa quattro tasche, due interne e due esterne.`:``),
				location: `ufficio`,
				linkedObjects: [`taschePiumino`],
				visible: false,
				worn:false,
				on: {
					lookAt: () => {
						if (this.playerHas(this.adventureData.objects.piumino)) 
							this.discover(this.adventureData.objects.taschePiumino, true)
						return null
					},
					wear: () => {
						if (!this.playerHas(this.adventureData.objects.piumino))
							this._addInInventory(this.adventureData.objects.piumino)
						return this.wear(`piumino`, `Ti sta proprio bene.`)
					},
					takeOff: () => this.takeOff(`piumino`),
					drop: async () => {
						if (this.currentRoom == this.adventureData.rooms.ufficio) 
							await this.CRT.printTyping(`Lo rimetti nell'attaccapanni.`)
						return await this._removeFromInventory(this.inventory.piumino)
					},
				}
			},

			taschePiumino: {
				visible: false,
				pattern: `tasc(?:a|he)`,
				on: {
					'open|lookAt': () => {
						let objects = this.adventureData.objects;
						if(objects.badge.visible)
							return `Dopo un'attenta ispezione concludi che sono tutte e quattro vuote.`
						this.discover(objects.badge)
						if(this.playerHas(objects.piumino))
							this._addInInventory(objects.badge)
						return `Da una di esse estrai un oggetto rigido... è il tuo badge personale!`;
					}
				}
			},
			badge: {
				label: `un badge`,
				pattern: `badge`,
				location: `ufficio`,
				visible: false,
				read: false,
				worn: false,
				linkedObjects: ['foto'],
				description: () =>  `Sopra c'è la tua foto e ` + (this.playerHas(this.adventureData.objects.occhiali) ? `il numero del badge: 098074` : `un numero poco distinguibile.`),
				on: {
					'lookAt|read': () => {
						this.discover(this.adventureData.objects.foto, true)
						
						if(this.playerHas(this.adventureData.objects.occhiali))
							this.getObject(`badge`).read = true
						return null
					},
					'useWith|bringCloser': async (mSubjects) => {
						let i = this.currentRoom.interactors
						let o = this.currentRoom.objects
						if(mSubjects[1] == i.lettoreBadge){
							if (i.lettoreBadge.visible != true)
								return i.lettoreBadge.description()

							i.porta.locked = false;
							await this.CRT.printTyping(`Avvicini il badge al lettore e...`,{printDelay: 75, cr: false});
							await this.CRT.sleep(1000);
							await this.CRT.printTyping(`Bzzzzzzz`);
							await this.CRT.sleep(1500);
							return `La porta ha vibrato per qualche secondo...`
						}
						return null
					},
					drop: () => {
						this.adventureData.objects.foto.visible = false
						return null
					},
					wear: () => this.wear(`badge`, `Hai indossato il tuo badge.`),
					takeOff: () => this.takeOff(`badge`),
				}
			},
			foto: {
				visible: false,
				pattern: `foto`,
				on: {
					lookAt: () => `E' una foto di dieci anni fa...`
				}
			},
			libro: {
				label: `un libro`,
				pattern: `libro`,
				location: `ufficio`,
				read: false,
				visible: false,
				takenOnce: false,
				linkedObjects: ['copertina','segnalibro',`pagina`],
				description: () => this.adventureData.objects.libro.visible ? `Ha una copertina grigia e un segnalibro all'interno.` : `Non saprei quale scegliere.`,
				on: {
					lookAt: () => {
						this.discover(this.adventureData.objects.segnalibro, true)
						this.discover(this.adventureData.objects.copertina, true)
						this.discover(this.adventureData.objects.pagina, true)
						return null
					},
					'open|read': () => {

						if (this.playerHas(this.adventureData.objects.libro)){
							this.adventureData.objects.libro.on.lookAt()
							this.inventory.libro.read = true;
							return `E' un romanzo di Stephen King, dal titolo INSOMNIA. Apri il libro all'altezza del segnalibro e trovi una pagina bianca sulla quale è stato scritto a matita: "ymd"`
						}
						return this.adventureData.objects.libro.visible ? `Dovrei prenderlo prima...` : this.adventureData.objects.libro.description()
					},
					take: () => this.adventureData.objects.libro.visible || this.adventureData.objects.libro.takenOnce ? null : this.adventureData.objects.libro.description(),
					drop: () => {
						this.inventory.libro.takenOnce = true
						if(this.currentRoom.key == "ufficio"){
							this.inventory.libro.visible = this.currentRoom.interactors.ante.open;
							this._removeFromInventory(this.inventory.libro,this.currentRoom.key)
							console.log(this.adventureData.objects.libro)
							return "Lo rimetti nel mobile."
						}
						return null
					}
				}
			},
			copertina: {
				visible:false,
				pattern: `copertina`
			},
			segnalibro: {
				visible: false,
				pattern: `segnalibro`,
				on:{
					lookAt: `E' un segnalibro di cartoncino nero.`
				}
			},
			pagina: {
				visible: false,
				pattern: `pagin(?:a|e)`,
			}


		},

		/* SEQUENZE */
		sequences:{
			titolo: async () => {
				this.CRT.clear();
				await this.CRT.println(i18n.title, {nlAfter: 1, waitBefore: 1000});
				await this.CRT.wait();
				this.CRT.clear();
				
			},
			prologo: async () => {
				await this.CRT.printTyping(`Accidenti che mal di testa....`, {waitBefore: 1000})
				await this.CRT.printTyping(`Come ho fatto ad addormentarmi in ufficio?`, {waitBefore: 1500})
				await this.CRT.printTyping(`E quanto tempo è passato?`, {waitBefore:1000})
				await this.CRT.printTyping(`Uhm... `, {cr: false, waitBefore: 1500})
				await this.CRT.printTyping(`E' tutto troppo silenzioso qui.`, {waitBefore: 2000});
				await this.CRT.printTyping(`Sarà meglio tornare a casa.`, {nlAfter: 1,waitBefore: 1500,waitAfter: 2000})
			},
			crollo: async () => {
				await this.CRT.printTyping(`Appena esci dall'ufficio la porta dietro di te si richiude pesantamente!`, {waitAfter: 1500})
				await this.CRT.printTyping(`Non vedi l'ora di tornare a casa. Il tuo ufficio è così claustrofobico... per fortuna adesso sei fuori da quella stanza opprimente.`, {waitAfter: 2000})
				await this.CRT.printTyping(`Percorri con passo svelto il corridoio fino in fondo, quindi inizi a scendere le scale che ti portano al piano terra. All'inizio procedi con cautela, poi sempre più rapidamente...`, {waitAfter: 2500})
				await this.CRT.printTyping(`Finalmente arrivi in fondo alle scale!`,{cr: false,waitAfter: 1500})
				await this.CRT.printTyping(` Improvvisamente però... `,{printDelay: 75, cr:false, waitAfter: 1500});
				await this.CRT.printTyping(`BOOM!`, {waitAfter: 2000})
				await this.CRT.printTyping(`Prima senti un'esplosione...`,{printDelay: 75, cr:false, waitAfter: 1000})
				await this.CRT.printTyping(` poi la terra inizia a tremare fortissimo!`, {printDelay: 75, waitAfter: 2000})
				await this.CRT.printTyping(`Cerchi riparo mentre le scale dietro di te crollano...`,{nlAfter: 1, waitAfter: 3000})
				if(this.adventureData.timedEvents.earthquake.currentStep > 10)
					this.adventureData.timedEvents.earthquake.currentStep = 10
			},
			finale: async() => {
				await this.CRT.printTyping(`Dopo aver aperto il portone quel poco che basta per farti uscire, corri come un forsennato verso il parcheggio.`, {waitAfter: 4000})
				await this.CRT.printTyping(`Una tremenda scossa di terremoto di durata interminabile fa crollare l'edificio. Cadi a terra dalla violenza, ma essendo fuori all'aperto non hai conseguenze gravi.`, {waitAfter: 5000})
				await this.CRT.printTyping(`Appena la scossa si attenua, riesci finalmente ad alzarti...`, {waitAfter: 2000, cr:false})
				await this.CRT.printTyping(`Non credi ai tuoi occhi...`, {waitAfter: 1500})
				await this.CRT.wait();
				await this.CRT.printTyping(`Osservi sbalordito la scena apocalittica davanti a te. Non solo l'edificio dove lavoravi è stato raso al suolo ma la stessa sorte è toccata a tutta la città...`, {waitAfter: 3000})
				await this.CRT.printTyping(`Mentre l'oscurità della notte avanza, inizi a correre, per quanto ti è possibile, in direzione di casa tua, con la flebile speranza di poter riabbracciare la tua famiglia...`, {printDelay:50,waitAfter: 5000})
				await this.CRT.wait();
				await this.CRT.printTyping(`-FINE-`, {waitBefore: 1000, waitAfter: 1000})
				await this.byebye()
				return false;
			}
		},
		timedEvents: {
			earthquake: {
				start: 60,
				onLimit: async () => {
					await this.CRT.printTyping(`-RUMBLE-`,{blinking:true, nlBefore: 1, waitBefore: 1500});
					await this.CRT.printTyping(`Ed eccola la madre di tutte le scosse di terremoto!`, {waitBefore: 1500});
					await this.CRT.printTyping(`Le pareti si crepano e il soffitto crolla sopra di te...`,{printDelay: 75, waitBefore: 1500});
					await this.CRT.printTyping(`Non hai nemmeno il tempo di sentire dolore. Il buio ti avvolge...`,{printDelay: 75, nlAfter: 1, waitBefore: 2500});
					this.die();
				},
				steps: {
					50: async () => this.CRT.printTyping(`Ehi... mi è sembrato di sentire una vibrazione sotto i piedi...`,{nlBefore: 1, waitBefore: 1500}),
					39: async () => this.CRT.printTyping(`Un'altra... stavolta era proprio una scossa, l'ho avvertita bene!`,{nlBefore: 1, waitBefore: 1500}),
					27: async () => this.CRT.printTyping(`Accipicchia, questa era forte... è durata anche diversi secondi...`,{nlBefore: 1, waitBefore: 1500}),
					17: async () => this.CRT.printTyping(`Inizio a sentire degli scricchiolii...`,{nlBefore: 1, waitBefore: 1500}),
					12: async () => this.CRT.printTyping(`Ancora una piccola scossa... e nuovi scricchiolii...`,{nlBefore: 1, waitBefore: 1500}),
					7: async () => this.CRT.printTyping(`Un'altra scossa, stavolta più forte...`,{nlBefore: 1, waitBefore: 1500}),
					5: async () => this.CRT.printTyping(`L'ennesima scossa... abbastanza forte! Oscilla tutto qui! Sarà meglio sbrigarsi ad uscire!`,{nlBefore: 1, waitBefore: 1500}),
					
				}
			}
		}

	}

}