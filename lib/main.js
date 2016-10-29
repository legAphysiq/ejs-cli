var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

var inf;
var outf;
var src;
var data;
var options;

// probably not the proper way to handle errors
var handleError = function(err){
	console.log(err.toString());
	process.exit(1);
}

// todo
var parseFile = function(file, cb){
	fs.readFile(file, 'utf8', function(err, str){
		if (err) {
			cb(err);
		}
		try{
			var parsed = JSON.parse(str);
			cb(null, parsed);
		}
		catch(e){
			cb(e.toString());
		}
	})
}

var readInputFile = function(){
	return new Promise(function(resolve, reject){
		fs.readFile(inf, 'utf8', function(err,str){
			if (err) {reject(err);}
			else {
				src = str;
				resolve();
			}
		});
	});
}

// data can be a file or text passed from the cli
var parseData = function(){
    return new Promise(function(resolve, reject){
        if (fs.existsSync(data)) {
            parseFile(data, function(err, dataObj){
            	if (err){reject('Failed to parse data from file '+data+'.\n'+err.toString())}
        		else{
        			data = dataObj;
        			resolve();
        		}
            })
        }
        else {
        	try{
        		data = JSON.parse(data);
        		resolve();
        	}
        	catch(e){
        		reject('Failed to parse data.\n'+e.toString());
        	}
        }
    })
}

// options can be a file or text passed from the cli
var parseOptions = function(){
    return new Promise(function(resolve, reject){
        if (fs.existsSync(options)) {
            parseFile(options, function(err, optionsObj){
            	if (err){reject('Failed to parse options from file '+options+'.\n'+err.toString())}
        		else{
        			options = optionsObj;
        			resolve();
        		}
            })
        }
        else {
        	try{
        		options = JSON.parse(options);
        		resolve();
        	}
        	catch(e){
        		reject('Failed to parse options.\n'+e.toString());
        	}
        }
    })
}

var render = function(){
	return new Promise(function(resolve, reject){
		var html;
		try{
			html = ejs.render(src, data, options);
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
		.then(parseData, handleError)
		.then(parseOptions, handleError)
		.then(render, handleError)
		.then(writeOutputFile, handleError)

}