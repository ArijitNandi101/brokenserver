"use strict";
					/*SERVER.JS*/

const http = require('http');
const path = require('path');
const fs = require('fs');
const route = require('./route');
const lib = require('./lib');
const settingsManager = require('./settingsmanager');
//const logger = require('./logger');


function Application(){
	this.router = route.Router();
	this.settingsManager = settingsManager;
}

Application.prototype.set = function(key,value){
	this.settingsManager.set(key,value);
};


Application.prototype.listen = function(port){
	const server = http.createServer((req,res) => {
		//console.log(req.url,req.method);
		this.router(req,res,function(){});
	});

	const PORT = port || process.env.PORT || 8080;
	server.listen(PORT,
		() => { console.log(`server started and now listening on port ${PORT} ...`); }
	);
	this.server = server;
	return server;
};

Application.prototype.get = function(path,callbackFunction) {
	if(arguments.length === 1){
		return this.settingsManager.get(arguments[0]);
	}
	this.router.get(path,callbackFunction);
	return null;
};

Application.prototype.post = function(path,callbackFunction) {
	this.router.post(path,callbackFunction);
};

Application.prototype.use = function(path,middleware) {
	this.router.use(path,middleware);
};

module.exports = function() {
	return new Application();
}

module.exports.static = lib.loadStatic;

/////////////////////////////////////////////////////////////////
var brokenserver = module.exports;
var app = brokenserver();
app.listen();
app.get("/",(req,res) => {
	res.writeHead(200, {'Content-Type':'text/html'});
	res.write(req.url+"<br/>");
	res.write(req.method+"<br/>");
	res.write(JSON.stringify(req.headers)+"<br/>");
});
app.use("/assets",brokenserver.static(__dirname + "/public"));
