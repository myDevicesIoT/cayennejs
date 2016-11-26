const routes = require('routes');
const mqtt = require('mqtt');
const DataTypes = require('./datatypes.js');
const TYPE = DataTypes.TYPE;
const UNIT = DataTypes.UNIT;
const events = require('events');
const Router = routes();
const THINGS = 'things';


var Cayenne = function(options) {
  apiVersion = "v1";
  this.options = options;

  this.debug = this.options.debug || false;
  this.ssl = this.options.ssl || false;

  this.broker = this.options.broker || "mqtt.mydevices.com";

  this.client = null;
  this.connected = false;

  this.rootTopic = [
    apiVersion,
    this.options.username,
    THINGS,
    this.options.clientId
  ].join('/');

};

Cayenne.prototype.__proto__ = events.EventEmitter.prototype;

Cayenne.prototype.connect = function(callback) {
  const self = this;
  thingTopic = this.rootTopic;

  this.client = mqtt.connect("mqtt://" + this.broker, {
      username: this.options.username,
      password: this.options.password,
      clientId: this.options.clientId,
  });

  this.client.on('connect', function () {
      self.connected = true;
      self.client.subscribe(self.rootTopic + '/cmd/+');

      return callback(null, self.client);
  });

  this.client.on('message', self.onMessage.bind(self));

  const cmdTopic = apiVersion + '/:username/'+THINGS+'/:thingId/cmd/:channel';
  Router.addRoute(cmdTopic, this.handleCommand.bind(this));

}

Cayenne.prototype.rawWrite = function(channel, value, type, unit) {
    var topic = this.getDataTopic(channel);
    var payload;

    if (unit === undefined) {
        unit = "null";
    }

    if (type === undefined) {
        payload = "" + value;
    } else {
        payload = type + "," + unit + "=" + value;
    }

    this.client.publish(topic, payload);
};


Cayenne.prototype.getDataTopic = function (channel) {
    return this.rootTopic + '/data/' + channel;
};

Cayenne.prototype.handleCommand = function (req) {
  const payload = req.payload.split(',');
  const seq = payload[0];
  const cmd = payload[1];

  this.client.publish(this.rootTopic + '/response', 'ok,'+seq);
  this.client.publish(this.rootTopic + '/data/' + req.meta.channel, cmd);

  this.emit("cmd" + req.meta.channel, req);
}

Cayenne.prototype.onMessage = function(topic, payload)  {
    var route = Router.match(topic);

    if (!route) {
      return;
    }

    var req = {
       path: topic,
       payload: payload.toString(),
       meta: route ? route.params: null,
       splats: route ? route.splats : null
    };

   return route.fn(req);
}

Cayenne.prototype.celsiusWrite = function (channel, value)  {
    this.rawWrite(channel, value, TYPE.TEMPERATURE, UNIT.CELSIUS);
}

Cayenne.prototype.fahrenheitWrite = function (channel, value)  {
    this.rawWrite(channel, value, TYPE.TEMPERATURE, UNIT.FAHRENHEIT)
}

Cayenne.prototype.kelvinWrite = function (channel, value)  {
    this.rawWrite(channel, value, TYPE.TEMPERATURE, UNIT.KELVIN)
}

Cayenne.prototype.luxWrite = function (channel, value)  {
    this.rawWrite(channel, value, TYPE.LUMINOSITY, UNIT.LUX)
}

Cayenne.prototype.pascalWrite = function (channel, value)  {
    this.rawWrite(channel, value, TYPE.BAROMETRIC_PRESSURE, UNIT.PASCAL)
}

Cayenne.prototype.hectoPascalWrite = function (channel, value)  {
    this.rawWrite(channel, value, TYPE.BAROMETRIC_PRESSURE, UNIT.HECTOPASCAL)
}

module.exports = Cayenne;
