
var SerialPort = require("serialport");
var serialConf = { baudRate: 9600 };
var serialDevice = "/dev/ttyUSB0";
var encoding = 'utf8';

// Call this function to get a two element tuple of
// [humidity, heatIndex] (fahrenheit)
//
// The API:
//  weather().then(function(report) {
//    console.log("Humidity is: ", report[0]);
// })
function weather() {
  return new Promise(function (resolve, reject) {
    function onReadable() { port.read() }

    function parseData(data) {
      try {
        resolve(JSON.parse(data.toString(encoding)));
      } catch (error) {

      }
    }
    var serialPort = new SerialPort(serialDevice, serialConf);

    // Switches the port into "flowing mode"
    serialPort.on('data', parseData);

    // Read data that is available but keep the stream from entering //"flowing mode"
    serialPort.on('readable', onReadable);
  });
}

module.exports = weather;

// weather().then(function (report) {
//   console.log("Humidity: ", report[0]);
//   console.log("Fake temperature: ", report[1]);
// });
