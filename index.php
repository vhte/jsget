<!DOCTYPE HTML>
<html lang="en">
	<head>
		<title>Get plugin for js files</title>
		<meta charset="utf-8">
		<script src="jsget.js"></script>
		<script src="one.js?foo=123&bar=someoption"></script>
		<script src="jquery-1.7.1.min.js"></script>
		<script src="three.js?jquery=itsok"></script>
		<script src="two.js?filename=two"></script>
		<script>
			var r = new Jsget;
			console.log('index.php -> '+r.get('foo'));
		</script>
		
	</head>
	
	<body>
		<h1>Hello World!</h1>
		
		
	</body>
</html>