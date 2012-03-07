/**
 * Jsget
 * 
 * Allows querystring use inside .js files and <script> tags
 * 
 * @author	Victor Torres - talk@victortorr.es
 * @version	1.0.1b
 * @since	02/2012
 * @param 	string	file Optional. If empty, js script itself. If a string url is passed (with querystring), jsget will read it instead of page or .js url.
 * @returns	Object
 * @example	var r = new Jsget("http://google.com/?this=is&a=parameter"); console.log(r.getParams('a')); // Should return 'parameter'
 * @example	var r = new Jsget;console.log(r.getParams('foo')); // if src from <script> is "one.js?foo=123&bar=someoption" it should return 123
 * @todo	get() Allow Object or Array as parameter.
 * @todo	Filter methods that allow any use for badwords, decodes, changes, etc.
 * @todo	status code. Any querystring error inside __params should be reported
 */
function Jsget(file) {
	
	// Object public attributes and "methods" (js doesn't have methods, but functions as methods [or something like])
	
	/**
	 * get
	 * 
	 * Returns all or one parameter from url querystring.
	 * If key's empty, return the entire object (keys and values) of querystring (__params)
	 * if key isn't found, return false
	 * then, return the key value
	 * 
	 * @param	string	key
	 * @param	string	type	Tries to define an acceptable type for key value
	 * @return	mixed
	 */
	this.get = function(key, type) {
		if(key === undefined)
			return __params;
		else if(__params[key] === undefined)
			return false;
		else {
			// good, we have a valid key. Now, if the 2nd param is setted, we need to try a valid type
			if(type !== undefined) {
				var find = __findType(__params[key], type); // Warning: If the defined type is not the real key type, returns the string key value anyway as string (for forceful, check validType()). If error, false (check console)
				return find.value;
			}
			else // No type was especified. Just return the key value (as string)
				return __params[key];
		}
	};
	
	/*
	 * validType
	 * 
	 * Returns the value of a key if it has the same type of parameter string
	 * Undefined does not exists because get() will already check if key exists.
	 * NULL means empty string (i.e '?foo=')
	 * 
	 * @param	string	key
	 * @param	string	type	A primitive/complex javascript type ['null','string','integer','float','array','object']
	 * @return	string|bool	key value or false if not valid
	 * @example	validType('foo', 'string')
	 * @todo	string ok but how about numeric? Could it be splitted in intger and float?
	 * @todo	any bool form?
	 */
	this.validType = function(key, type) {
		var valid = ['null','string','integer','float','array','object'];
		type = type.toLowerCase();
		
		// Check if type parameter has a valid value
		if(valid.indexOf(type) === -1) { // no match inside array
			// This is used 2 times. Better put in a private method
			__console('error', 'The "type" parameter is invalid inside a validType(), please check documentation.\nYou wrote "'+type+'" and valid values are: %o', valid);
			return false;
		}
		
		// Param validation ok, attempt to retrieve value type
		var v = __findType(__params[key], type);
		//console.log(v);
		//console.log(typeof(v.value)+' = '+type);
		
		// Just check __findType() and type
		if(v.type !== type)
			return false;
		
		// Ok, true type and param type are the same
		return v.value;
	};
	
	/**
	 * toString
	 * 
	 * Returns the original (but encoded) querystring from file url.
	 * 
	 * @return 	string
	 */
	this.toString = function() {
		return __queryString;
	};
	
	/************* PRIVATE STATEMENTS *************/
	var __queryString = ''; // Contains the original querystring from file. Just for basic user access
	var __params = {}; // Contains the valid key=>value objects of splitted querystring
	
	/**
	 * __findType
	 * 
	 * Tries to find a cohesive type to passed str
	 * 
	 * @param	string	str		A value (new String() object)
	 * @return	mixed	If error, false. Anything else {type, value}
	 * @todo	Object and array... seems to be the same
	 */
	var __findType = function(str) {
		// Creates object and tries to get the type of 'str'
		var ret = {type: null, value: null};
		
		// 1st: null
		if(!str) {
			ret.type = 'null';
			ret.value = null;
		}
		// 2nd: float (it accepts ,) and number. Note: If 1,3a, javascript will try to fix it with parseFloat() to 1.3 
		else if(!isNaN(parseFloat(str.replace(',', '.')))){ // @todo perhaps a var = parseFloat...
			var floatTest = parseFloat(str.replace(',', '.'));
			
			// check if has a dot to confirm a float value
			if(floatTest.toString().split('.').length === 2) {
				ret.type = 'float';
				ret.value = floatTest; // real type will be number
			}
			
			else {
				ret.type = 'integer';
				ret.value = floatTest;
			}
			//console.log((!isNaN(parseInt(str)) ? parseInt(str) : 'NaN'));
			//console.log(str+' typeof = '+typeof(floatTest)+' parseFloat = '+parseFloat(floatTest)+' parseInt = '+parseInt(floatTest));
		}
		// Object
		else if(str.charAt(0) === '{' && str.charAt(str.length-1) === '}') {
			var objectTest = eval('('+str+')');
			
			ret.type = 'object';
			ret.value = objectTest;
		}
		// Array
		else if(str.charAt(0) === '[' && str.charAt(str.length-1) === ']') {
			var arrayTest = eval('('+str+')'); // Array do not have indexes
			
			ret.type = 'array';
			ret.value = arrayTest;
		}
		
		else { // Anything else is a string, the default type. If you think it's wrong or should be something else, could be because a malformed object/array string
			ret.type = 'string';
			ret.value = str;	
		}
		
		// Return new typed var
		return ret;
	};
	
	/**
	 * __console
	 * 
	 * Throw a message if console is enabled.
	 * 
	 * @param	string	type	log type. [log,warn,info]
	 * @return	void	Console message
	 * @see		http://getfirebug.com/wiki/index.php/Console_API
	 */
	var __console = function(type, message, extra) {
		// Verifies if console isn not enabled, so there's nothing to do here.
		if(typeof(console) !== 'object')
			return false;
		
		var ex = (typeof(extra) !== 'undefined' ? extra : '');
			
		switch(type) {
			case 'warn':
				console.warn(message, ex); break;
			case 'info':
				console.info(message, ex); break;
			case 'error':
				console.error(message, ex); break;
			default: // "log"
				console.log(message);
		}
	};
	
	/*********** __CONSTRUCT *********************/
	(function(){
		// if no file is specified at constructor param and no src attr is found (empty means code between <script></script>), then get document itself
		if(file === undefined && document.scripts[document.scripts.length-1].src !== '')
			file = document;
		else {
			// string or selfscript
			var newfile = {}; // new Object()
			newfile.src = (typeof(file) === 'string' ?
					file // if string, simulates document scripts attribute as object
					: document.location.href); // anything else means you're using this class inside a <script> tag in your html. So, we get the page base url. Our file now assumes the own text/html document
			file = {scripts: [newfile]};
		}
		
		// get only querystring from file object
		__queryString = file.scripts[file.scripts.length-1].src.replace(/^[^\?]+\??/,'');
		
		// if doesn't exists (i.e malformed url), class ends here
		if(!__queryString || __queryString === '') {
			// if console, generates error
			if(typeof(console) === 'object') {
				console.error('Unable to load your querystring. Check it.', this);
			}
			return;
		}
			
			
		// splitting &
		var p = __queryString.split(/[;&]/);
		
		var keyVal;
		
		// generates array[key] = val
		for(var i=0;i<p.length;i++) {
			keyVal = p[i].split('=');
			if(!keyVal || keyVal.length !== 2)
				continue;
			
			__params[unescape(keyVal[0])] = unescape(keyVal[1]).replace(/\+/g, ' ');
		}
		
		
		// IE indexOf fix
		if(!Array.indexOf){
		    Array.prototype.indexOf = function(obj){
		        for(var i=0; i<this.length; i++){
		            if(this[i] === obj){
		                return i;
		            }
		        }
		        return -1;
		    };
		}
	}());
	
	
}