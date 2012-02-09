/**
 * Jsget
 * 
 * Allows querystring use inside .js files and <script> tags
 * 
 * @author	Victor Torres - talk@victortorr.es
 * @version	0.8
 * @since	02/2012
 * @param 	string	file Optional. If empty, js script itself. If a string url is passed (with querystring), jsget will read it instead of page or .js url.
 * @returns	Object
 * @example	var r = new Jsget("http://google.com/?this=is&a=parameter"); console.log(r.getParams('a')); // Should return 'parameter'
 * @example	var r = new Jsget;console.log(r.getParams('foo')); // if src from <script> is "one.js?foo=123&bar=someoption" it should return 123
 * @todo	get() Allow Object or Array as parameter.
 * @todo	Filter methods that allow any use for badwords, decodes, changes, etc.
 * @todo	Console object integration
 * @todo	status code. Any querystring error inside __params should be reported
 */
function Jsget(file) {
	
	// Object public attributes and "methods" (js doesn't have methods, but functions as methods [or something like])
	/**
	 * queryString
	 * 
	 * Contains the original querystring from file. Just for basic user access
	 */
	this.queryString = '';
	
	/**
	 * get
	 * 
	 * Return all or one parameter from url querystring.
	 * If key's empty, return the entire object (keys and values) of querystring (__params)
	 * if key isn't found, return false
	 * then, return the key value
	 * 
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
												: document.location.href); // anything else means you're using this class inside a <script> tag in your html. So, we get the page base url. Our file now assumes the own text/html document
		file = {scripts: [newfile]};
	}
	
	// get only querystring from file object
	this.queryString = file.scripts[file.scripts.length-1].src.replace(/^[^\?]+\??/,'');
	
	// if doesn't exists (i.e malformed url), class ends here
	if(!this.queryString || this.queryString === '') {
		// if console, generates error
		if(typeof(console) === 'object') {
			console.error('Unable to load your querystring. Check it.', this);
		}
		return;
	}
		
		
	// splitting &
	var p = this.queryString.split(/[;&]/);
	
	var keyVal;
	
	// generates array[key] = val
	for(var i=0;i<p.length;i++) {
		keyVal = p[i].split('=');
		if(!keyVal || keyVal.length != 2)
			continue;
		
		__params[unescape(keyVal[0])] = unescape(keyVal[1]).replace(/\+/g, ' ');
	}
	
}