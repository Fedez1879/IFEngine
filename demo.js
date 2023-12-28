class Avventura extends IFEngine{
	constructor(){
		super();
		
		this.CRT.defaultCR = false;

		this.defaultInput = "\n] "

		// DATI AVVENTURA
		this.adventureData = {
			// stanza iniziale
			startingRoom: "ufficio",
			
			/* STANZE */
			rooms: {

				// 01.AEREO
				ufficio: {
					label: "Ufficio",
					description: () => "Sei nel tuo ufficio. Davanti a te si estende la scrivania, piena di appunti. Sotto di essa c'è una cassettiera di ferro. Sulla parete si staglia un moderno mobile a vetri. La luce entra dalle finestre a ovest, mentre a est si trova l'unico ingresso della stanza.",
					directions: {
						//e: "corridoio"
						//defaultMessage: "Quella direzione è preclusa"
					},
					interactors: {
						scrivania: {
							label: "la scrivania",
							description: "E' una classica scrivania da ufficio in legno."
						},
						soggetto: {
							label: "il soggetto",
							description: "Che tipo",
							live: true,
							initialDescription: () => "Un soggetto di tipo "+(this.currentRoom.interactors.soggetto.live ? "A" : "B")
						}
						
					},
					onEnter: async () => {
						if(this.adventureData.prologue){
							this.adventureData.prologue = false;
							//await this.runSequence("prologo");
						} 
					},
				},

			},

			/* OGGETTI */
			objects: {
	
				chiave: {
					label: [
						"una chiave di ottone",
						"una chiave di argento"
					],
					status: 0,
					pattern: "chiave((?: di)? ottone)?",
					description: "E' una chiave di ottone.",
					location: "ufficio",
					initialDescription: "C'è una chiave di ottone appoggiata sul tavolo",
					on: {
						take: () => { 
							this.currentRoom.objects.chiave.status++ 
							return null
						}
					}
				},
				occhiali: {
					label: "un paio di occhiali",
					pattern: "(?:paio (?:di )?)?occhiali",
					description: "Sono occhiali per astigmatici e ipermetropi.",
					location: "ufficio",
					on: {
						drop: "Meglio di no, potrebbero servirti in furturo."
					}
				}
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
					await this.CRT.wait();
					await this.CRT.println("volpini.federico79@gmail.com\n");
					await this.CRT.println("licenza MIT\n");
					await this.CRT.wait();
					this.CRT.clear();
					
				},
				prologo: async () => {
					await this.CRT.sleep(1000);
					await this.CRT.printTyping("Accidenti....",{cr:false})
					await this.CRT.sleep(1500);
					await this.CRT.printTyping("Come ho fatto ad addormentarmi in ufficio?")
					await this.CRT.sleep(1000);
					await this.CRT.printTyping("Quanto tempo è passato?")
					await this.CRT.sleep(1500);
					await this.CRT.printTyping("Uhm... ",{cr:false})
					await this.CRT.sleep(2000);
					await this.CRT.printTyping("E' tutto troppo silenzioso qui. Sarà meglio tornare a casa.",{nlAfter:2})
					await this.CRT.sleep(1500);
				}
			}
		}
	}
	
	// Override di IFEngine.run
	async run(){
		await this.runSequence("titolo");
		this.displayMenu(this.menu.main);
	}

}
