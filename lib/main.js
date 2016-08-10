var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

module.exports = function(){
	// console.log(arguments);
	var inf = arguments[0];
	var outf = arguments[1];
	var data = arguments[2];
	var options = arguments[3];

	// probably not the proper way to handle errors
	var handleError = function(err){
		console.log(err);
		process.exit(1);
	}

	var readInputFile = function(){
		return new Promise(function(resolve, reject){
			fs.readFile(inf, 'utf8', function(err,data){
				if (err) {reject(err);}
				else {resolve(data);}
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
				else{
					process.exit(0);
				}
		});
	}

	readInputFile()
		.then(render, handleError)
		.then(writeOutputFile, handleError)

}