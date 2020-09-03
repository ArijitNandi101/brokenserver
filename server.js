"use strict";

const http = require('http');
const path = require('path');
const fs = require('fs');
//const logger = require('./logger');


const server = http.createServer((req,res) => {
	res.writeHead(200, { "Content-Type": "text/html"});
	res.write("request received:<br>");
	res.write(req.method+"<br>");
	res.write(req.url+"<br>");
	res.write(JSON.stringify(req.headers)+"<br>");
	res.end();
});

const PORT = process.env.PORT || 8080;

server.listen(PORT,
	() => { console.log(`server started and now listening on port ${PORT} ...`); }
); 
