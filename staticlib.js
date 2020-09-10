"use strict";

const path = require('path');
const fs = require('fs');

function loadStatic(directory){
	return function(req,res,next) {
		var filename = path.posix.basename(req.url);
		console.log("middleware4");
		fs.readdir(directory,function(err,files) {
			if(err){ 
				console.log("error in loading directory: ",err);
				return;
			}
			else if(filename == '' || !files.includes(filename)){
				res.write("filename:'"+filename+"' not found");
				next();
			}else {
				console.log(directory+'/'+filename);
				var stream = fs.createReadStream(directory+"/"+filename,'utf8');
				stream.on('data',(chunk) => { res.write(chunk); });
				stream.on('end',() => { next(); });
			}
		});
		console.log("outer");
	}
};


module.exports.loadStatic = loadStatic;