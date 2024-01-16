i18n = {
	...i18n,
	...{

		htmlTitle: `L'ufficio - IFEngine Demo`,
		title: `       _                         
 __   | |    ___ ___ _     _     
|  |  |_|_ _|  _|  _|_|___|_|___ 
|  |__  | | |  _|  _| |  _| | . |
|_____| |___|_| |_| |_|___|_|___|
                                 
     Una demo dell'IFEngine      
     ----------------------
                                   
             _| o                   
            (_| |                   
     __                     
    |_  _  _| _  __ o  _  _ 
    |  (/_(_|(/_ |  | (_ (_)
                       
      \\ / _  |  _  o __  o    
       v (_) | |_) | | | |    
               |

  (volpini.federico79@gmail.com)`,
		DemoThesaurus: {
			defaultMessages: {
				beSerious: `Sii serio!`,
				notNow: `Adesso non ho voglia.`,
				done: `Ok.`
			},
			commonPatterns: {
				wall: `mur(?:o|a)|paret(?:e|i)`,
				floor: `pavimento`,
				ceiling: `soffitto`
			},
			commands: {
				exit: {
					pattern: `(esci|scappa|fuggi)(?: da )?(?:stanza|qui)?`,
					defaultMessage: `Vorrei, ma sono bloccato qui.`
				},
				help: {
					pattern: `aiuto`
				},
				run: {
					pattern: `corri`,
					defaultMessage: `Non serve a niente.`
				}
			}
		}
	}
}
