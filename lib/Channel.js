
/*
 * Cayenne Channel
 * Author: @laurenceHR
 * Last Modification: 11-02-2017
 */

const DataTypes = require('./datatypes.js');
const TYPE = DataTypes.TYPE;
const UNIT = DataTypes.UNIT;
 
var events = require('events');
var util = require('util');

var Channel = function (Client,channel){  
  this.Client = Client;
  this.channel = channel;

  this.topicPub = Client.buildTopicPub(channel);
  this.topicSub = Client.buildTopicSub(channel);
  this.topicRes = Client.buildTopicRes(channel);  
  return this;
}
util.inherits(Channel, events.EventEmitter);

Channel.prototype.handleMessage = function(state,hash){
  this.log('handleMessage',[state]);
  this.emit('message',state,hash);
  return this;
}
Channel.prototype.publish = Channel.prototype.value = function(msg){  
  this.Client.publishTopic(this.topicPub,msg);
  return this;
}

Channel.prototype.switchOn = function(){  
  this.Client.publishTopic(this.topicPub,'1');
  return this;
}

Channel.prototype.switchOff = function(){  
  this.Client.publishTopic(this.topicPub,'0');
  return this;
}

Channel.prototype.celsius = function (value)  {
    this.Client.rawWrite(this.channel, value, TYPE.TEMPERATURE, UNIT.CELSIUS);
}

Channel.prototype.fahrenheit = function (value)  {
    this.Client.rawWrite(this.channel, value, TYPE.TEMPERATURE, UNIT.FAHRENHEIT)
}

Channel.prototype.kelvin = function (value)  {
    this.Client.rawWrite(this.channel, value, TYPE.TEMPERATURE, UNIT.KELVIN)
}

Channel.prototype.lux = function (value)  {
    this.Client.rawWrite(this.channel, value, TYPE.LUMINOSITY, UNIT.LUX)
}

Channel.prototype.pascal = function (value)  {
    this.Client.rawWrite(this.channel, value, TYPE.BAROMETRIC_PRESSURE, UNIT.PASCAL)
}

Channel.prototype.hectoPascal = function (value)  {
    this.Client.rawWrite(this.channel, value, TYPE.BAROMETRIC_PRESSURE, UNIT.HECTOPASCAL)
}

Channel.prototype.log = function(type,data){
  return this.Client.log(type,data);  
}

module.exports = Channel;