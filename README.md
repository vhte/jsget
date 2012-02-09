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
Simple. When using ready/load statements, you tell the script to wait until full DOM (or even more, like images) is loaded. If DOM is loaded and jsget is called inside a ready/load statement, it will get the latest &lt;script&gt; written in your HTML document. Maybe this ready/load script could be your last &lt;script&gt; tag inside document. **Avoid it**

