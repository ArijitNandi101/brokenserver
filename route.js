"use strict";
const EventEmitter = require('events');

class RouteEventEmitter extends EventEmitter{
	constructor(){
		super();
		this.routes = {
			get: {},
			post: {}
		};
	}
	onPath(method,path,callbackFunction) {
		if(this.routes[method]){
			this.routes[method][path] = callbackFunction;
		}else{
			console.log("method "+method+" for path "+path+" can not be defined");
		}
	}
	emitPath(method,path,req,res) {
		if(method in this.routes && path in this.routes[method]){
			this.routes[method][path](req,res);
		}else{
			res.write(method+" method on requested path "+path+" is forbidden");
		}
	}
};
const router = new RouteEventEmitter();
function routeRequest(req,res){
	router.emit('request',req,res);

};
router.on('request',function(req,res){
	this.emitPath(req.method.toLowerCase(),req.url,req,res);
});

function get(path,callbackFunction){
	router.onPath('get',path,callbackFunction);
};

function post(path,callbackFunction){
	router.onPath('post',path,callbackFunction);
};

module.exports = {
	routeRequest,
	get,
	post
};
