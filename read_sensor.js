
var SerialPort = require("serialport");
var serialConf = { baudRate: 9600 };
var serialDevice = "/dev/ttyUSB0";
var encoding = 'utf8';
var serialPort = new SerialPort(serialDevice, serialConf);

function processData(tuple) { console.dir(tuple); }
function onReadable() { port.read() }

function parseData(data) {
  try {
    processData(JSON.parse(data.toString(encoding)));
  } catch (error) {

  }
}

// Switches the port into "flowing mode"
serialPort.on('data', parseData);

// Read data that is available but keep the stream from entering //"flowing mode"
serialPort.on('readable', onReadable);
