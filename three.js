/*
 * You should remember the difference between window and document load
 * Window = Everything (including images) is loaded.
 * Document = Just DOM is ready, images could be still loading...
 */

// Take care with global vars
var threeJquery = new Jsget;
$(document).ready(function() {
	answers += 'three.js[document.ready] = ' + threeJquery.get('jquery') + '\n';
});



var three = new Jsget;
// You can't use 2 window.onload functions at same page. The true window.onload is in .html file wich calls this function
function jsgetWindowOnload() {
	answers += 'three.js[window.onload] = ' + three.get('jquery') + '\n';
};