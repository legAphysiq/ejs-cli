var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

var inf;
var outf;
var data;
var options;

// probably not the proper way to handle errors
var handleError = function(err){
	console.log(err);
	process.exit(1);
}

var readInputFile = function(){
	return new Promise(function(resolve, reject){
		fs.readFile(inf, 'utf8', function(err,str){
			if (err) {reject(err);}
			else {resolve(str);}
		});
	});
}

var render = function(str){
	return new Promise(function(resolve, reject){
		var html;
		try{
			html = ejs.render(str, data, options);
			resolve(html);
		} catch (err) {
			reject(err);
		}
	});
}

var writeOutputFile = function(html){
	fs.writeFile(outf, html, function(err){
			if (err) {
				handleError(err);
			}
	});
}

module.exports = function(){
	// console.log(arguments);
	inf = arguments[0];
	outf = arguments[1];
	data = arguments[2];
	options = arguments[3];

	readInputFile()
		.then(render, handleError)
		.then(writeOutputFile, handleError)

}