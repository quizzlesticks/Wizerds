const fullPropertyPrinter = function(o) {
	let s = "";
	for (var key in o) {
		s += key + ": " + o[key] + "<br>";
	}
	return s;
};