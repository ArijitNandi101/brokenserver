"use strict";
const EventEmitter = require('events');
const middleware = require('./middleware');

class RouteEventEmitter extends EventEmitter{
	constructor(){
		super();
		this.middlewareManager = middleware.getNewManager();
		this.middlewareManager.addDefault('get',function(req,res){
			res.write(req.method + " request for path " + req.url + " is forbidden!");
		});
		this.on('request',function(req,res) {
			this.middlewareManager.run(this.middlewareManager.match(req.method.toLowerCase(),req.url),req,res);
		});
	}
	
	onMiddleware(path,middleware){
		if(this.middlewareManager.addMiddleware(path,middleware)){
			console.log("invalid middleware "+middleware.toString()+" for path "+path);
		}
	}

	onMethod(method,path,callbackFunction) {
		if(this.middlewareManager.addMethod(method,path,callbackFunction))
			console.log("invalid method" + method + " for path " + path);
	}
};

const router = new RouteEventEmitter();

function routeRequest(req,res){
	router.emit('request',req,res);

};

function use(){
	var path = '/';
	if(arguments.length === 1){
		 var middlewareIndex = 0;
	}else{
		path = arguments[0];
		var middlewareIndex = 1;
	}
	for(let i=middlewareIndex;i<arguments.length;i++)
		router.onMiddleware(path,arguments[i]);
}

function get(){
	var path = '/';
	if(arguments.length <= 1 ){ 
		console.log("bad routing arguments for get: ");
		return;
	}
	path = arguments[0];	
	for(let i=1;i<arguments.length;i++)
		router.onMethod('get',path,arguments[i]);
};

function post(){
	var path = '/';
	if(arguments.length <= 1 ){ 
		console.log("bad routing arguments for get: ");
		return;
	}
	path = arguments[0];
	for(let i=1;i<arguments.length;i++)
		router.onMethod('post',path,arguments[i]);
};

module.exports = {
	routeRequest,
	use,
	get,
	post
};
