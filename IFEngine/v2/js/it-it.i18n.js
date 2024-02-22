var i18n = {
	htmlTitle: `IFEngine Demo`,
	title: `IFEngine Demo`,
	CRT: {
		waitText: `Premere invio per continuare...`
	},
	IFEngine: {
		SAVEDPrefix: `Avventura`,
		warnings: {
			mustBeExtended: `IFEngine deve essere esteso`,
			notLoaded: `Nessuna avventura caricata`,
			localstorageInactive: `Per poter effettuare salvataggi è necessario attivare il localstorage nel browser.`,
			localstorageMustBeActivated: `Attivare il localstorage nel browser.`,
			labelNotValid: `Etichetta non valida. Riprovare.`,
			noData: `Nessun dato da caricare...`,
			notFound: (filename) => `Salvataggio "${filename}" non trovato.`
		},
		menu: {
			choose: `Vuoi:`,
			new: `Iniziare una nuova avventura`,
			load: `Riprendere una situazione salvata`,
			readInstructions: `Ripassare le istruzioni`,
			quit: `Uscire dal gioco`,
			restart: `Rincominciare dall'inizio`,
			stop: `Smettere di giocare`
		},
		questions: {
			quitQuestion: `Vuoi smettere di giocare`,
			areYouSureQuestion: `Sei sicuro`,
			saveLabel: `Etichetta salvataggio (X annulla):`,
			restoreLabel: `Etichetta (X annulla, E per elenco):`,
			cancelLetter: `X`,
			listLetter: `E`,
			what: `che cosa?`
		},
		yesOrNo:{
			yes: `si`,
			no: `no`
		},
		messages: {
			tanksForPlaying: `Grazie per aver giocato. Ciao! :)`,
			saved: `Dati salvati!`,
			loaded: `Dati caricati...`,
			noInstructions: `Nessuna istruzione qui...`,
			death: `SEI MORTO!!!`,
			noPoints: `Quest'avventura non prevede un punteggio`,
			points: (data) => `Hai conquistato ${data.points} punti su ${data.maxPoints} in ${data.moves} mosse`,
			moves: (moves) => `Hai giocato ${moves} mosse`,
			noObjects: `Non hai oggetti con te.`,
			carriedObjectsLabel: `Stai portando con te:`,
			alreadyHaveIt: `Ce l'hai già.`,
			alreadyDone: `L'hai già fatto.`,
			notHere: `Non vedi nulla del genere.`
		},
		questionMark: `?`,
		containing: `contenente`,
		prepareInputSteps: [
			{
				pattern: `[\\.,:;!"£\\$%&\\/\\(\\)=°\\+\\*]*`,
				replaceWith: ``
			},
			{
				pattern: `'`,
				replaceWith: ` `
			},
			{
				pattern: ` (i|il|la|lo|le|li|l|gli|un|uno|una) `,
				replaceWith: ` `
			},
			{
				pattern: ` +`,
				replaceWith: ` `
			},
			{
				pattern: ` (del|dell|dello|degli|dei|della|delle) `,
				replaceWith: ` di `
			},
			{
				pattern: ` (al|all|allo|agli|alla|alle) `,
				replaceWith: ` a `
			},
			{
				pattern: ` (dal|dall|dallo|dagli|dalla|dalle) `,
				replaceWith: ` da `
			},
			{
				pattern: ` (nel|nell|nello|negli|nella|nelle|dentro) `,
				replaceWith: ` in `
			},
			{
				pattern: ` (col|coi) `,
				replaceWith: ` con `
			},
			{
				pattern: ` (sul|sull|sullo|sugli|sulla|sulle|sopra) `,
				replaceWith: ` su `
			},
			{
				pattern: ` (tra|fra) `,
				replaceWith: ` tra `
			},

		],
		ISee: `Vedi`
	},
	Thesaurus: {
		defaultMessages: {
			done: `Fatto!`,
			preferNot: `Preferisco di no.`,
			notFound: `Il verbo "cerca" è troppo generico per me. Devi indicarmi azioni più specifiche...`,
			dontUnderstand: `Non ho capito...`,
			dontNoticeAnythingInParticular: `Non noto nulla di particolare.`,
			notSeenHere: `Qui non ne vedo.`, 
			dontHaveAny: `Non hai niente del genere con te.`, 
			nothingHappens: `Non succede niente.`,
			beMoreSpecific: `Sii più specifico.`,
			notPossible: `Non è possibile.`,
			tooDarkHere: `E' troppo buio.`,
			here: `Quello che cerchi è qui!`,
			alreadyHaveIt: `Ce l'hai già.`,
			doesntOpen: `Non si apre.`,
			doesntClose: `Non si chiude.`,
			doesntMove: `Non si muove.`
		},
		commands: {
			north: {
				pattern: `(vai verso |vai a |vai )?(n(ord)?)`,
				defaultMessage: `Non puoi andare a nord.`
			},
			south: {
				pattern: `(vai verso |vai a |vai )?(s(ud|outh)?)`,
				defaultMessage: `A sud non si passa.`
			},
			east: {
				pattern: `(vai verso |vai a |vai )?(e(st)?|east)`,
				defaultMessage: `A est non si può andare.`
			},
			west: {
				pattern: `(vai verso |vai a |vai )?(o(vest)?|w(est)?)`,
				defaultMessage: `Ad ovest non è possibile andare.`
			},
			up: {
				pattern: `(sali|(vai verso |vai in |vai )?a(lto)?|u(p)?|su)`,
				defaultMessage: `Nessun passaggio verso l'alto.`
			},
			down: {
				pattern: `(scendi|(vai verso |vai in |vai )?b(asso)?|d(own)?|giu)`,
				defaultMessage: `Più in basso di così non riesco a scendere.`
			},
			save:{
				pattern: `save|salva`,
			},
			load: {
				pattern: `load|carica`,
			},
			instructions: {
				pattern: `istruzioni`,
			},
			inventory: {
				pattern: `i(?:nv)?|inventario`,
			},
			quit: {
				pattern: `esci da gioco|basta|stop`,
			},
			where: {
				pattern: `dove(?:sono|mi trovo)?|guarda|l`,
			},
			points: {
				pattern: `punt(?:i|eggio)`,
			},
			moves: {
				pattern: `mosse|turni`
			}
		},
		verbs: {
			open: {
				pattern: `apri`,
			},
			close: {
				pattern: `chiudi`
			},
			pull: {
				pattern: `tira`
			},
			press: {
				pattern: `premi`
			},
			push: {
				pattern: `spingi`
			},
			take: {
				pattern: `prendi|raccogli`
			},		
			drop: {
				pattern: `lascia|posa`
			},
			give: {
				pattern: `(dai) (.+) (?:a) (.+)`
			},
			useWith: {
				pattern: `(usa) (.+) (?:con|su) (.+)`
			},
			use: {
				pattern: `usa`
			},
			lookAt: {
				pattern: `guarda(?: in| su| da)?|esamina|ispeziona|x`
			},
			search:{
				pattern: `cerca|trova`
			}
		}
	}
}
