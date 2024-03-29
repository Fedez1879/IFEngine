class Parser{
	constructor(verbs, commands){
		this.verbs = verbs;
		this.commands = commands;
		this.override = {};

	}

	setOverride(override){
		this.override = override ? override : {};
		//console.log(override);
	}

	parse(input){
		// O è un comando imperativo
		// O è un verbo
		
		let c = this._parse(input, this.commands, true);
		return c === false ? 
			this._parse(input, this.verbs, false) : 
			c;
	}

	_parse(input, sorgente, patternEsatto){
		
		let override = patternEsatto ? 
			(this.override.commands === undefined ? {} : this.override.commands) :
			(this.override.verbs === undefined ? {} : this.override.verbs);
		

		for (let chiave in sorgente){
			let obj = { ...sorgente[chiave]};
			
			let overrideObj = this._getSource(chiave,override);
			if(overrideObj){
				if(typeof overrideObj == 'function'){
					obj.callback = overrideObj;
				} 
				else  
					obj = { ...sorgente[chiave], ...overrideObj};
			}
			
			let pattern = 
				obj.pattern === undefined ? 
				"("+chiave+")" : 
				(
					typeof obj.pattern == 'function' ? 
					obj.pattern() : 
					(
						obj.pattern.substr(0,1) != "(" ? 
						`(${obj.pattern})` :
						obj.pattern
					)
				);
			
			if(
				sorgente != this.commands && 
				override != this.override.commands && 
				input.indexOf(" ") == -1 && 
				(obj.single === undefined || obj.single == false) 
			){
				let matches = input.match(new RegExp("^"+pattern+"$", 'i'));
				if(matches != null)
					return input;
			}

			if(patternEsatto == false){
				if(
					(obj.movement === undefined || obj.movement == false) && 
					(obj.complex === undefined || obj.complex == false)
				){
					pattern += obj.single ? 
					"(?:\\s+(.+))?" : 
					"\\s+(.+)"; 
			 	}
			} 

			pattern = new RegExp("^"+pattern+"$", 'i');
			let matches = input.match(pattern);
			
			// console.log(input, pattern,matches);

			if(matches != null){

				let subjects = [];
				let i = 2;

				// Se è un movement e lo posso usare singolarmente
				// mappo la direction con l'attributo "direction" 
				

				if(obj.direction !== undefined)
					subjects.push(obj.direction);
				else {
					// mappo i "soggetti" della mia azione
					while(i < matches.length && matches[i] != undefined){
						subjects.push(matches[i].trim());
						i++;
					}
			
				}	
				
				// Rirotno un oggetto contenente l'azione e i soggetti
				let APO = {
					verb: chiave,
					actionObject: obj,
					command: sorgente == this.commands, //patternEsatto == true,
					subjects: subjects
				}

				//console.log(APO)
				return APO
				
			}
			
		}

		return false;
	}

	_getSource(key, source,separator){

		if(separator === undefined)
			separator = "|";


		for (let k in source){
			let i =k.split(separator);
			let p = i.filter((e) => {return key==e;});
			if(p.length > 0)
				return source[k];
		}

		return null;
	}
	
}

