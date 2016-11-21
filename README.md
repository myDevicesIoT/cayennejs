# Cayenne IoT Node.JS API

Use this library to quickly connect your device to Cayenne Cloud. For more information see our [API Documentation](http://www.cayenne-mydevices.com/docs/#bring-your-own-thing-api-mqtt-messaging-topics)

```
npm install cayennejs
```

```javascript
var Cayenne = require('cayennejs');

// Initiate MQTT API
const cayenneClient = new Cayenne.MQTT({
  username: "foobar",
  password: "secret",
  clientId: "thing-id"
});

cayenneClient.connect((err, mqttClient) => {
  // dashboard widget automatically detects datatype & unit
  cayenneClient.kelvinWrite(3, 65);

  // sending raw values without datatypes
  cayenneClient.rawWrite(4, 123);

  // subscribe to data channel for actions (actuators)
  cayenneClient.on("cmd9", function(data) {
    console.log(data);
  });

});

```
