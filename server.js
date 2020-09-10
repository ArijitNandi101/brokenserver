"use strict";

const http = require('http');
const path = require('path');
const fs = require('fs');
const route = require('./route');
const staticlib = require('./staticlib');
//const logger = require('./logger');

module.exports.listen = function(port){
	const server = http.createServer((req,res) => {
		console.log(req.url,req.method);
		route.routeRequest(req,res);
	});
	const PORT = port || process.env.PORT || 8080;
	server.listen(PORT,
		() => { console.log(`server started and now listening on port ${PORT} ...`); }
	);
} 

module.exports.get = function(path,callbackFunction) {
	route.get(path,callbackFunction);
}

module.exports.post = function(path,callbackFunction) {
	route.post(path,callbackFunction);
}

module.exports.use = function(path,middleware) {
	route.use(path,middleware);
}

module.exports.static = staticlib.loadStatic;

/////////////////////////////////////////////////////////////////
exports.get("/",(req,res) => {
	res.writeHead(200, {'Content-Type':'text/html'});
	res.write(req.url+"<br/>");
	res.write(req.method+"<br/>");
	res.write(JSON.stringify(req.headers)+"<br/>");
	console.log("get request write" + req.url);
});
exports.use("/assets",exports.static(__dirname + "/public"));

exports.listen();
