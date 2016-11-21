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

i=0
timestamp = 0

function loop() {
    if (Date.now() > timestamp + 10000) {
        cayenne.celsiusWrite(1, i);
        cayenne.luxWrite(2, i*10);
        cayenne.hectoPascalWrite(3, i+800);
        timestamp = Date.now();
        i = i+1;
    }
}

cayenne.connect(function() {
    console.log('MQTT connected');
    setInterval(loop, 5000);
});

