const Cayenne = require('../');

const cayenneClient = new Cayenne.MQTT({
  username: "",
  password: "",
  clientId: ""
});

describe('MQTT connection', function() {

  it('should connect with valid credentials', function(done) {
    cayenneClient.connect(done);
  });

  it('should send sensor data', function(done) {
    cayenneClient.kelvinWrite(3, 65);

    done();
  });

  it('should subscribe to channel and receive data', function (done) {
    cayenneClient.on("cmd9", function(){
      setTimeout(done, 1000);
    });
  });
});
