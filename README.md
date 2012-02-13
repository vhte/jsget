Jsget
=====

A simple way to enable querystring in javascript files. It can also be used with typed url strings or current page url.

### How it works ###

Jsget was created to add a feature that doesn't exists natively in javascript, but could help webdevelopers offering a common serverside script functionality.

First of all, when a new object is created, jsget will search the last &lt;script&gt; tag of the partial DOM loaded. The last &lt;script&gt; tag is the script that jsget is working at moment, then the querystring from src attr is loaded and each key=>val element is placed inside an object local variable.
After that, you need to call get() method with a string as parameter. This string should be one of querystring loaded keys (see `How to use` section for examples).


### How to use ###

You've 3 ways to implement jsget in your page.

1st - Inside a js file

```html
<script src="file.js?foo=bar&key=value"></script>
```

**file.js?foo=bar&key=value**

```html
<script>
	var g = new Jsget;
	document.write(g.get('foo')); // returns 'bar'
	document.write(g.get('key')); // returns 'value'
	document.write(g.get('anything')); // returns false
</script>
```

2nd - A typed url

```html
<script src="file.js?foo=bar"></script>
```

**file.js?foo=bar**

```html
<script>
	var g = new Jsget('http://example.com/page?out=side');
	document.write(g.get('out')); // returns 'side'
	document.write(g.get('foo')); // returns false
</script>
```

3rd - Directly inside a &lt;script&gt; tag in HTML document

**file.html?foo=bar&new=one&two=whatever**

```html
<script>
	var g = new Jsget;
	document.write(g.get('two')); // returns 'whatever'
	// ... (you get it)	
</script>
```


### Working with js types ###

Jsget `get(param)` will always return false or a string. In some situations you could need a primitive or complex js type that was the really intention for a GET value (i.e in ?foo=12.3 `get('foo')` should return 12.3 as `number` type)

To get a value as it "should be" type, just use the second parameter with `get()`. Jsget'll try to change the original type (string) to the defined one.

**file.js?foo=12.3**

```html
<script>
	var r = new Jsget;
	document.write(r.get('foo', 'float')); // returns 12.3 as a numeric type
</script>
```

Also, if you wanna a strict type validation (i.e I need foo to receive an integer type, any other type should be an error), `validType` could help. This function will validate the type you defined with the true type that jsget will retrieve.

**file.js?foo=12**

```html
<script>
	var r = new Jsget;

	// Jsget will first transform (string)12 to (number)12 and next validate with 'integer' type. Any type incompatibility will return false. If types are ok, just return 12 (as number object).
	document.write(r.validType('foo', 'integer'));
</script>
```

The second param from `get()` and `validType()` share the same configuration. Jsget support these:

* __null__ To empty strings like `?foo=`
* __float__ Floating point numbers like `?foo=12.3`
* __integer__ Integer numbers `?foo=12`
* __object__ You can also use string objects (like JSON) `?foo={a:'b',c:'d'}`
* __array__ Arrays looks like objects, but more simple `?foo=['one','two','three']`

Undefined type is useless here because all functions need to verify the existence of all keys called.

### Limitations ###

Javascript files can't know their own filename, only the page which loaded them. This is a language limitation, so like explained at `How it works` section, jsget needs to walk with DOM construction and read the last &lt;script&gt; tag loaded (which is the DOM pointer position).

What is this about? You can't use jsget inside ready or load statements. Look:

**file.js?foo=bar**

```html
<script>
	var r = new Jsget;
	document.write(r.get('foo')); // returns 'bar'
</script>
```

**file.js?good=day**

```html
<script>
	window.onload = function() {
		var r = new Jsget;
		document.write(r.get('good')); // Wrong! It probably should not return what you expect...
	};
</script>
```

**file.js?jquery=iscool**

```html
<script>
	$(document).ready(function(){
		var r = new Jsget;
		document.write(r.get('jquery')); // Wrong! Same as above
	});
</script>
```

**file.js?use=jquery**

```html
<script>
	var r = new Jsget;
	$(document).ready(function(){
		document.write(r.get('use')); // Ok! Class instance is outside ready/load statement
	});
</script>
```

In `window.load` example above it should not return what I expect. What 'write' method will return then?
Simple. When using ready/load statements, you tell the script to wait until full DOM (or even more, like images) is loaded. If DOM is loaded and jsget is called inside a ready/load statement, it will get the latest &lt;script&gt; written in your HTML document. Maybe this ready/load script could be your last &lt;script&gt; tag inside document. **Avoid it**.
