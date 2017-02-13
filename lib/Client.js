'use strict'
/*
 * Cayenne Client
 * Author: @laurenceHR
 * Last Modification: 11-02-2017
 */
 
const mqtt = require('mqtt');
const events = require('events');
const util = require('util');  
let MqttClient;

// Legacy
const THINGS = 'things';

var Channel = require('./Channel');

var Client = function (options) {  	
  	var clientId,username,password;
  	var MqttClient;
  	var topics;
  	var listeners;  	
  	var channnels;

  	this.debug = options && options.debug || false;  	
  	this.broker = this.server = options && options.server || 'mqtt://mqtt.mydevices.com';
  	this.clientId = options.clientId;
  	this.username = options.username;
  	this.password = options.password;
  	
  	this.channnels = {};
  	this.listeners = {};
  	this.topics = {};

  	this.emit('init');

  	// Legacy
	this.apiVersion = "v1";	
	this.ssl = options && options.ssl || false;	
	this.client = null;
	this.connected = false;
	this.rootTopic = [
		this.apiVersion,
		this.username,
		THINGS,
		this.clientId
	].join('/');
  	// Legacy

  	return this;
}
util.inherits(Client, events.EventEmitter);
Client.prototype.__proto__ = events.EventEmitter.prototype;

Client.prototype.buildTopicPub = function(channel){
	return this.apiVersion + '/' + this.username + '/' + THINGS + '/' + this.clientId + '/data/' + channel;
}
Client.prototype.buildTopicSub = function(channel){
	return this.apiVersion + '/' + this.username + '/' + THINGS + '/' + this.clientId + '/cmd/' + channel;
}
Client.prototype.buildTopicRes = function(){
	return this.apiVersion + '/' + this.username + '/' + THINGS + '/' + this.clientId + '/response';
}

Client.prototype.connect = function(callback) {
	const self = this;
	MqttClient = self.MqttClient = mqtt.connect(self.server,{
		clientId: self.clientId,
		username: self.username,
		password: self.password
	});
	self.emit('connect',self);
	self.MqttClient.on('connect', function(){ self.emit('connect'); });
	self.MqttClient.on('message', function (topic, message,packet){		
		self.handleMessage(topic,message,packet);
	});
	if(callback) callback();

  	return this;
}

Client.prototype.suscribe = function(channel){
	const self = this;
	const topic = this.apiVersion + '/' + this.username + '/' + THINGS + '/' + this.clientId +'/cmd/' + channel;	
	self.listeners[channel] = true;		
	self.MqttClient.subscribe(topic);
	return this;
}
Client.prototype.unsuscribe = function(channel){
	const self = this;
	const topic = this.apiVersion + '/' + this.username + '/' + THINGS + '/' + this.clientId +'/cmd/' + channel;	
	delete self.listeners[channel];	
	return this;
}
Client.prototype.publishCallback = function(channel,message,hash){
	const self = this;		   
	self.log('publishCallback()',[channel,message,hash]);
	self.publishChannel(channel,message);
	self.publishSuccess(hash);
	return this;
}
Client.prototype.publishChannel = function(channel,message){
	const self = this;
	self.log('publishChannel()',[channel,message]);
	const topic = self.buildTopicPub(channel);
	self.MqttClient.publish(topic,message);
	return this;	
}
Client.prototype.publishTopic = function(topic,message){
	const self = this;
	self.log('publishTopic()',[topic,message]);
	self.MqttClient.publish(topic,message);	
}	

Client.prototype.publishSuccess = function(hash){
	const self = this;
	self.log('publishSuccess()',[hash]);
	const topic = self.buildTopicRes();
	self.MqttClient.publish(topic,'ok,'+ hash);
}
Client.prototype.publishError = function(msg){
	const self = this;
	self.log('publishError()',[msg]);
	const topic = self.buildTopicRes();
	self.MqttClient.publish(topic,'error,msg='+ msg);
}

Client.prototype.handleMessage = function(topic,message,packet){
	const self = this;
	const msg = message.toString();
	const hash = msg.split(',')[0];
	const state = msg.split(',')[1];
	self.log('handleMessage()',[topic,msg]);
	self.emit('message',state,hash);		
	const channel = topic.split('/').pop();
	if( self.listeners[channel] !== 'undefined' ){		
		self.publishCallback(channel,state,hash);	
	}
	if( self.channnels[channel] !== 'undefined' ){		
		const Channel = self.channnels[channel];
		Channel.handleMessage(state,hash);
	}
}
Client.prototype.Channel = function(ch){
	const self = this;
	const Ch1 = new Channel(self,ch);	
	self.suscribe(ch);
	self.channnels[ch] = Ch1;
	return Ch1;
}
Client.prototype.log = function(type,data){
	if(this.debug){
		console.log(type + ' ' + data.join(','));
	}
}

// Legacy
Client.prototype.rawWrite = function(channel, value, type, unit) {
    const topic = this.buildTopicPub(channel);
    let payload;
    if (unit === undefined) {
        unit = "null";
    }
    if (type === undefined) {
        payload = "" + value;
    } else {
        payload = type + "," + unit + "=" + value;
    }
    this.MqttClient.publish(topic, payload);
};

module.exports = Client;
