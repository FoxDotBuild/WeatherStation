// === TEMP SENSOR SETUP ===

const sensor = require("node-dht-sensor").promises;
const sensorType = 22;
const sensorPin = 18;

if (process.env.SKIP_DHT_STUFF) {
  console.warn("NOT AN RPI; SIMULATING DHT.");
  sensor.initialize({
    test: {
      fake: {
        temperature: 21,
        humidity: 60
      }
    }
  });
}

function createTemperaturePost() {
  const res = sensor.readSync(sensorType, sensorPin);
  const text = [
    "Temperature (F):",
    res.temperature.toFixed(1) * 9 / 5 + 32,
    "Humidity:",
    res.humidity.toFixed(1)
  ].join(" ");
  return { type: 'post', text }
}

// == SERVER SETUP ===

const pull = require('pull-stream')
const Client = require('ssb-client')

const createWeatherChecker =
  (server) => () => {
    server.publish(createTemperaturePost(), (err, msg) => {
      if (err) throw err
      console.dir(msg);
      console.log("Just published a message.");
    });
  }

Client(function (err, server) {
  if (err) throw err
  var checkWeather = createWeatherChecker(server);
  server.publish({ type: 'post', text: 'Power re-applied' });
  checkWeather();
  setInterval(checkWeather, 1000 * 60 * 60 * 24);
});
