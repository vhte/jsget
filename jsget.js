/**
 * Jsget
 * 
 * Classe que habilita o uso de querystrings em arquivos .js e em tags <script> simples
 * 
 * @author	Victor Torres
 * @since	02/2012
 * @param 	string	file Opcional. Caso vazio é o script .js em si, caso seja passado uma string com uma querystring, ela é acessado ao invés do arquivo.
 * @returns	Object
 * @example	var r = new Jsget("http://google.com/?this=is&a=parameter"); console.log(r.getParams('a')); // Should return 'parameter'
 * @example var r = new Jsget();console.log(r.getParams('foo')); // if src from <script> is "one.js?foo=123&bar=someoption" it should return 123
 * @todo	Any class instance inside document/window.ready works?
 * @todo	get() Permitir o uso de Array ou Object contendo + de 1 parâmetro. Retornar como objeto
 * @todo	Métodos que permitem algum tipo de filtro nos key=>values (bad word, decodificações, transformações, etc)
 */
function Jsget(file) 	
	// Object public attributes and "methods" (js doesn't have methods, but functions as methods [or something like])
	/**
	 * queryString
	 * 
	 * Contains the original querystring from file. Just for basic user access
	 * 
	 * @author	Victor Torres
	 * @since	02/2012
	 */
	this.queryString = '';
	
	/**
	 * get
	 * 
	 * Return all or one parameter from uri querystring.
	 * If key's empty, return the entire object (keys and values) of querystring (__params)
	 * if key isn't found, return false
	 * then, return the key value
	 * 
	 * @author	Victor Torres
	 * @since	02/2011
	 * @param	string	key
	 * @return	mixed
	 */
	this.get = function(key) {
		if(key === undefined)
			return __params;
		else if(__params[key] === undefined)
			return false;
		else
			return __params[key];
	};
	
	/************* PRIVATE STATEMENTS *************/
	var __params = {};
	
	/*********** __CONSTRUCT *********************/
	// if no file is specified at constructor param and no src attr is found (empty means code between <script></script>), then get document itself
	if(file === undefined && document.scripts[document.scripts.length-1].src != '')
		file = document;
	else {
		// string or selfscript
		var newfile = new Object(); // {}
		newfile.src = (typeof(file) === 'string' ?
												file // if string, simulates document scripts attribute as object
												: document.location.href); // anything else means you're using this class inside a <script> tag in your html. So, we get the page base uri. Our file now assumes the own text/html document
		file = {scripts: [newfile]};
	}
	
	// get only querystring from file object
	this.queryString = file.scripts[file.scripts.length-1].src.replace(/^[^\?]+\??/,'');
	
	// if doesn't exists (i.e malformed url), class ends here
	if(!this.queryString || this.queryString === '')
		return;
		
	// explodindo o &
	var p = this.queryString.split(/[;&]/);
	
	var keyVal;
	
	for(var i=0;i<p.length;i++) {
		keyVal = p[i].split('=');
		if(!keyVal || keyVal.length != 2)
			continue;
		
		__params[unescape(keyVal[0])] = unescape(keyVal[1]).replace(/\+/g, ' ');
	}
	
}