Jsget
=====

A simple way to enable querystring in javascript files. It can also be used with typed url strings or current page url.

### HOW IT WORKS ###

Jsget is builded to attend dynamic content deficiency js scripts have.
First of all, when a new object is created, jsget will search the last &lt;script&gt; tag of the partial DOM loaded. The last &lt;script&gt; tag is the script that jsget is working itself, then the querystring from src attr is loaded and each key=>val element is loaded inside an a class private var.
After, just call get() method with a string as parameter. This string should be one of querystring loaded keys (see HOW TO USE section for examples)


### HOW TO USE ###

You've 3 ways to implement jsget in your page.

1st - Inside a js file

```html
<script src="file.js?foo=bar&key=value"></script>
```

file.js?foo=bar&key=value

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

file.js?foo=bar

```html
<script>
	var g = new Jsget('http://example.com/page?out=side');
	document.write(g.get('out')); // returns 'side'
	document.write(g.get('foo')); // returns false
</script>
```

3rd - Directly inside a &lt;script&gt; tag in HTML document

file.html?foo=bar&new=one&two=whatever

```html
<script>
	var g = new Jsget;
	document.write(g.get('two')); // returns 'whatever'
	// ... (you get it)	
</script>
```


### LIMITATIONS ###

Javascript files can't know which name they have, only the page which loaded them. This is a language limitation, so, like explained at HOW IT WORKS section, jsget needs to walk with DOM construction and reads the last &lt;script&gt; tag loaded (which is the DOM pointer position).
What that means for me? You just can't use jsget inside ready or load statements. Look:

file.js?foo=bar

```html
<script>
	var r = new Jsget;
	document.write(r.get('foo')); // returns 'bar'
</script>
```

file.js?good=day

```html
<script>
	window.onload = function() {
		var r = new Jsget;
		document.write(r.get('good')); // Wrong! It probably should not return what you expect...
	};
</script>
```

file.js?jquery=iscool

```html
<script>
	$(document).ready(function(){
		var r = new Jsget;
		document.write(r.get('jquery')); // Wrong! Same as above
	});
</script>
```

file.js?use=jquery

```html
<script>
	var r = new Jsget;
	$(document).ready(function(){
		document.write(r.get('use')); // Ok! Class instance is outside ready/load statement
	});
</script>
```

You said it should not return what I expected. What 'write' method will return then?
Simple. When using ready/load statements, you tell the script to wait until full DOM (or even more, like images) is loaded. If DOM is loaded and jsget is called inside a ready/load statement, it will get the latest &lt;script&gt; written in your HTML document. So, if lucky, this ready/load script could be your last &lt;script&gt; tag inside document. Avoid it.

Jsget will work with anonymous functions? Sure, they're the best place to use this script (our DOM is partially loaded).
