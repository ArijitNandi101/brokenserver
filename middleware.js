"use strict";

function MiddlewareManager() {
	this.middlewares = {
	};
	this.routes = {
		get: { default: [] },
		post: { default: [] }
	}
}

MiddlewareManager.prototype.addDefault = function(method,callbackFunction) {
	if(!this.routes[method]) return 1;
	this.routes[method]['default'].push(function(req,res,ender) {
		callbackFunction(req,res);
		ender();
	});
	return 0;
}

MiddlewareManager.prototype.addMiddleware = function(path,middleware) {
	if(!middleware || middleware.length !== 3) return 1;
	if(!this.middlewares[path]){
		this.middlewares[path] = [];
	}
	this.middlewares[path].push(middleware);
	return 0;
}

MiddlewareManager.prototype.addMethod = function(method, path, callbackFunction) {
	if(!(method in this.routes)) return 1;
	if(!this.routes[method][path]){
		this.routes[method][path] = [];
	}
	this.routes[method][path].push(function(req,res,ender) {
		callbackFunction(req,res);
		ender();
	});
	return 0;
}

MiddlewareManager.prototype.match = function(method,url){
	var middlewareChain = [];
	var methodChain = [];
	Object.entries(this.middlewares).forEach(([key,value]) => {
		if(url.startsWith(key))
			middlewareChain = middlewareChain.concat(value);
	});
	if(method in this.routes) {
		Object.entries(this.routes[method]).forEach(([key,value]) => {
			if(url === key)
				methodChain = methodChain.concat(value);
		});
	}
	if(!middlewareChain.length && !methodChain.length) methodChain = this.routes[method]['default'];
	//console.log(middlewareChain,methodChain);
	return {middleware: middlewareChain,method: methodChain}
}

MiddlewareManager.prototype.run = function(chains,req,res){
	let i=0;
	var next = function() {
		//console.log("running middleware ",i,chains.middleware.length);
		if(i<chains.middleware.length) chains.middleware[i++](req,res,next);
		else{
			i=0;
			ender();
		}
	}
	var ender = function() {
		//console.log("running method ",i,chains.method.length);
		if(i<chains.method.length) chains.method[i++](req,res,ender);
		else res.end();
	}
	if(!chains.method){
		res.write("invalid request for path " + req.url + " using " + req.method + " method");
		res.end();
		return;
	}
	next.call(this);
}

module.exports.getNewManager = function() {
	return new MiddlewareManager();
}
