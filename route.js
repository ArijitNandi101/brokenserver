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
};
const router = new RouteEventEmitter();

function routeRequest(req,res){
	router.emit(req.method,req,res);

};
router.on('GET',function(req,res){
	if(req.url in this.routes.get){
		this.routes.get[req.url](req,res);
	}else{
		res.write(req.method+"method on requested path "+req.url+" is forbidden");
		res.end();
	}
});

router.on('POST',function(req,res){
	if(req.url in this.routes.post){
		this.routes.post[req.url](req,res);
	}else{
		res.write(req.method+" not allowed on "+req.url);
	}
});

function get(path,callbackFunction){
	router.routes.get[path]=callbackFunction;
};

function post(path,callbackFunction){
	router.routes.post[path]=callbackFunction;
};

module.exports = {
	routeRequest,
	get,
	post
};
