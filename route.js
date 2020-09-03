"use strict";
const EventEmitter = require('events');

class RouteEventEmitter extends EventEmitter{};

const router = new RouteEventEmitter();
const routes = {
	get: {},
	post: {}
};
function routeRequest(req,res){
	router.emit(req.method,req,res,routes);

};
router.on('GET',(req,res,routes) => {
	if(req.url in routes.get){
		routes.get[req.url](req,res);
	}else{
		res.write(req.method+"method on requested path "+req.url+" is forbidden");
		res.end();
	}
});

router.on('POST',(req,res,routes) => {
	if(req.url in routes.post){
		routes.post[req.url](req,res);
	}else{
		res.write(req.method+" not allowed on "+req.url);
	}
});

function get(path,callbackFunction){
	routes.get[path]=callbackFunction;
};

function post(path,callbackFunction){
	routes.post[path]=callbackFunction;
};

module.exports = {
	routeRequest,
	get,
	post
};
