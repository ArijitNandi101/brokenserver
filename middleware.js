"use strict";

function MiddlewareManager() {
	this.middlewares = {};
}

MiddlewareManager.prototype.add = function(path,middleware) {
	if(!middleware || middleware.length !== 3) return 1;
	if(!this.middlewares[path]){
		this.middlewares[path] = [];
	}
	this.middlewares[path].push(middleware);
	return 0;
}

MiddlewareManager.prototype.match = function(url){
	var middlewareChain = [];
	Object.entries(this.middlewares).forEach(([key,value]) => {
		if(url.startsWith(key))
			middlewareChain = middlewareChain.concat(value);
	});
	console.log(middlewareChain.length);
	return middlewareChain;
}

MiddlewareManager.prototype.run = function(middlewareChain,req,res){
	console.log("running "+middlewareChain.length+"middlewares....");
	middlewareChain.forEach((middleware) => {
		middleware(req,res,function() { console.log("ran middleware"); });		
	});
}

module.exports.getNewManager = function() {
	return new MiddlewareManager();
}
