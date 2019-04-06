var dhtSensorLib = require("node-dht-sensor");
var heatIndexLib = require("heat-index");

const sensorType = 22;
const sensorPin = 18;

// Call this function to get a two element tuple of
// [humidity, heatIndex] (fahrenheit)
//
// The API:
//  weather().then(function(report) {
//    console.log("Humidity is: ", report[0]);
// })
function weather() {
  return new Promise(function (resolve, reject) {
    function handleReading(err, temperature, humidity) {
      if (err)
        reject(err);
      else
      {
        var heatIndex = heatIndexLib.heatIndex({temperature, humidity});
        var heatIndexF = heatIndexLib.toFahrenheit(heatIndex);

        resolve([humidity, heatIndexF]);
      }
    }

    dhtSensorLib.read(sensorType, sensorPin, handleReading);
  });
}

module.exports = weather;
