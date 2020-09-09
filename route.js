"use strict";
const EventEmitter = require('events');
const middleware = require('./middleware');

class RouteEventEmitter extends EventEmitter{
	constructor(){
		super();
		this.middlewareManager = middleware.getNewManager();
		this.routes = {
			get: {},
			post: {}
		};
		this.on('request',function(req,res) {
			this.middlewareManager.run(this.middlewareManager.match(req.url),req,res);
			this.emitPath(req.method.toLowerCase(),req.url,req,res);
		});
	}
	
	addMiddleware(path,middleware){
		if(this.middlewareManager.add(path,middleware)){
			console.log("invalid middleware "+middleware.toString()+" for path "+path);
		}
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

function use(path,middleware){
	if(arguments.length === 1){
		middleware = arguments[0];
		path = '/';
	}
	router.addMiddleware(path,middleware);
}

function get(path,callbackFunction){
	router.onPath('get',path,callbackFunction);
};

function post(path,callbackFunction){
	router.onPath('post',path,callbackFunction);
};

module.exports = {
	routeRequest,
	use,
	get,
	post
};
