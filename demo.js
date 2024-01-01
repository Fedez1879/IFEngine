class Adventure extends DemoEngine{
	adventureData = {
		// stanza iniziale
		prologue: true,
		
		/* STANZE */
		rooms: {

			ufficio: {
				label: "Ufficio",
				description: () => {
					return "Sei nel tuo ufficio. La scrivania è come sempre piena di appunti. La cassettiera di ferro sotto di essa sembra in ordine. Sulla parete il moderno mobile a vetri riflette il tuo viso pallido. Dalla finestra a ovest entra una fioca luce arancione."
				},
				directions: {
					e: () => this.currentRoom.interactors.porta.on.open()
					//defaultMessage: "Quella direzione è preclusa"
				},
				interactors: {
					ufficio: {
						pattern: "ufficio",
						description: () => this.currentRoom.description()
					},
					pareti: {
						...this.commonInteractors.wall,
						...{
							description: () => "Le pareti sono spoglie, a parte "+(this.playerHas(this.adventureData.objects.occhiali) ? "": "(credo) ")+ "un calendario appeso di fianco alla scrivania.\nNella parete a est c'è la porta di ingresso, a fianco della quale c'è l'attaccapanni. Nella parete di fronte alla porta c'è l'unica finestra della stanza."
						}
					},
					calendario: {
						pattern: "calendario",
						description: () => this.playerHas(this.adventureData.objects.occhiali) ? "E' un calendario vecchio, del 1979. Attualmente mostra il mese di ottobre. Il giorno 18 è cerchiato in rosso." : this.Thesaurus.defaultMessages.NOTHING_PARTICULAR
					},
					attaccapanni: {
						pattern: "attaccapanni|appendiabiti",
						description: () => "E' di metallo nero, alto, con 4 braccia." + (this.currentRoom.jacket && this.currentRoom.jacket.visible ? "\nIn uno di essi è appeso il mio piumino nero." : "")
					},
					scrivania: {
						pattern: "scrivania",
						description: "E' una classica scrivania da ufficio in legno."
					},
					cassettiera: {
						spostabile: false,
						spostata: false,
						pattern: "cassettiera((?: di)? ferro)?",
						description: () => "E' una cassettiera da ufficio, di quelle che se apri un cassetto non puoi aprire gli altri...",
						on: {
							close: () => `E' già "chiusa"...`,
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
					cassetti:{
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
								return "Finalmente riesci ad aprire i cassetti. Da uno di essi tiri fuori un paio di occhiali e li appoggi sulla scrivania."
							},
							close: () => {
								if(this.currentRoom.interactors.cassetti.chiusiAChiave || this.currentRoom.interactors.cassetti.aperti == false)
									return "Più di così non posso!"
								return "Richiudi delicatamente i cassetti."
							},
							lookAt: () => this.currentRoom.interactors.cassetti.aperti ? "Sono pieni di cianfrusaglie!" : this.Thesaurus.defaultMessages.NOTHING_PARTICULAR,
							move: () => this.Thesaurus.defaultMessages.NOT_POSSIBLE
						}
					},
					cavi:{
						sistemabili: false,
						sistemati: false,
						pattern: "cav(?:o|i)",
						on: {
							move: () => {

								let cavi = this.currentRoom.interactors.cavi;

								if(cavi.sistemabili == false)
									return "Perché dovrei?"
								if(cavi.sistemati)
									return "Meglio lasciarli in ordine!"
								cavi.sistemati = true;
								this.currentRoom.interactors.cassettiera.spostabile = true;
								return "Adesso si che si ragiona, gli ho sistemati in modo che non intralcino più!"
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
								return "E' il classico pavimento flottante presente in quasi tutte le stanze del CNR, è grigio chiaro con striature più scure." + (this.currentRoom.interactors.cavi.sistemati == false ? "\nAccipicchia! vicino alla scrivania è tutto un groviglio di cavi!" : "");
							}

						}
					},
					soffitto: this.commonInteractors.ceiling,
					finestra: {
						pattern: `finestr(?:a|one)`,
						description: "Dalla finestra vedi il giardino e il parchegghio sottostante. Come al solito non ricordi dove hai messo la tua macchina!"
					},
					porta: {
						pattern: `porta`,
						description: "E' la porta del tuo ufficio. Accanto ad essa c'è un lettore badge e una pulsantiera.",
						on: {
							open: () => {
								return "Provi ad abbassare la maniglia e a tirare, ma la porta è bloccata. Ci deve essere qualche modo per aprirla, comunque."
							}
						}
					},
					lettoreBadge: {
						pattern: `lettore(?: badge)?`,
						description: `E' un lettore rfid, credo serva per aprire la porta col badge personale.`
					},
					pulsantiera: {
						pattern: `pulnanti(?:era)?`,
						description: `Nella pulsantiera ci sono solo numeri da 0 a 9.`,
						onPush: `Non saprei davvero cosa digitare`,
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
						if(targets[1] == i.cassettiera || targets[1] == i.cassetti){

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
				pattern: "(piumino|giacc(?:a|etto))(?: ner(?:o|a))?",
				description: "E' un piumino leggero, primaverile. E' molto semplice. Ha quattro tasche, due interne e due esterne.",
				location: "ufficio",
				linkedObjects: ["taschePiumino"],
			},
			taschePiumino: {
				label:"tasche",	
				pattern: "tasc(?:a|he)",
			},


		},

		/* SEQUENZE */
		sequenze:{
			titolo: async () => {
				this.CRT.clear();
				await this.CRT.sleep(1000);
				await this.CRT.println(" _ ___   ___         _         ");
				await this.CRT.println("| | __> | __._ _ ___<_._ _ ___ ");
				await this.CRT.println("| | _>  | _>| ' / . | | ' / ._>");
				await this.CRT.println("|_|_|   |___|_|_\\_. |_|_|_\\___.");
				await this.CRT.println("                <___'      ");
				await this.CRT.println("       ___                v.1.0");
				await this.CRT.println("      | . \\___._ _ _ ___        ");
				await this.CRT.println("      | | / ._| ' ' / . \\       ");
				await this.CRT.println("      |___\\___|_|_|_\\___/\n\n");
				
				await this.CRT.println("            |_                             ");
					await this.CRT.println("            |_) \\/");                    
					await this.CRT.println("                /");

				await this.CRT.println("    \\  / _  | ._  o ._  o     ");
				await this.CRT.println("     \\/ (_) | |_) | | | |     ");
				await this.CRT.println("  ___         |                ");
					await this.CRT.println("  |_ _   _|  _  ._ o  _  _  ");
				await this.CRT.println("  | (/_ (_| (/_ |  | (_ (_) \n");
				await this.CRT.println("volpini.federico79@gmail.com\n");
				await this.CRT.println("licenza MIT");
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
