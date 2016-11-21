#!/usr/bin/env node
const Cayenne = require('../');

const MQTT_USERNAME  = "4af7bb30-a878-11e6-a85d-c165103f15c2";
const MQTT_PASSWORD  = "00612fd8d84aff146beb773f6b118a5517115b27";
const MQTT_CLIENT_ID = "7e01b510-aeba-11e6-bfa5-7b3dd1a0d34e";

var cayenne = new Cayenne.MQTT({
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clientId: MQTT_CLIENT_ID,
});

cayenne.connect(function() {
    console.log("MQTT Connected");
});

cayenne.on('cmd3', function(channel, cmd) {
    console.log("Received <%s> on cmd channel %d", cmd, channel);
    
    // Process command and send data back
});
