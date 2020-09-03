"use strict";

const http = require('http');
const path = require('path');
const fs = require('fs');
const route = require('./route');
//const logger = require('./logger');


const server = http.createServer((req,res) => {
	console.log(req.url,req.method);
	route.routeRequest(req,res);
	res.end();
});

const PORT = process.env.PORT || 8080;

server.listen(PORT,
	() => { console.log(`server started and now listening on port ${PORT} ...`); }
); 


route.get("/",(req,res) => {
	res.writeHead(200, {'Content-Type':'text/html'});
	res.write(req.url+"<br/>");
	res.write(req.method+"<br/>");
	res.write(JSON.stringify(req.headers)+"<br/>");
	res.end();
});
