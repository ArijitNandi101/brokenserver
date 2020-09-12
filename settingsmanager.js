"use strict";
					/*SETTINGSMANAGER.JS*/

function SettingsManager(){
	this.root = __dirname;
	this.settings = {};
}

SettingsManager.prototype.set = function(key,value){
	if(arguments.length != 2){
		console.log("wrong number of arguments passed to set",arguments.length);
	}
	this.settings[key] = value;
}

SettingsManager.prototype.get = function(key){
	if(!(key in this.settings)){
		console.log("no settngs value is available for key:",key);
		return null;
	}
	return this.settings[key];
}

var settingsManager = new SettingsManager();

settingsManager.set("template engine", null);
settingsManager.set("view path", settingsManager.root + "/views");

module.exports = settingsManager;
