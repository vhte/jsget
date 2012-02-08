$(document).ready(function() {
	var r = new Jsget;
	console.log('three.js -> '+r.get('jquery'));
	console.log('Hello! I\'m a code inside a document.ready jquery script');
});

window.onload = function() {
	var r = new Jsget;
	console.log('three.js[2] -> '+r.get('jquery'));
};