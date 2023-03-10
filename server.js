const HID = require('node-hid');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');


// Find the device path of the SpaceMouse Compact
const devices = HID.devices();
const devicePath = devices.find(d => d.product === 'SpaceMouse Compact').path;

// Open the device
const device = new HID.HID(devicePath);

let x = 0;
let y = 0;
let z = 0;
let a = 0;
let b = 0;
let c = 0;
let h = 0;
let i = 0;
// Listen for data events

device.on('data', data => {

  const offset = 1;
  if (i === 0) {
    x = data.readInt16LE(offset);
    y = data.readInt16LE(offset + 2);
    z = data.readInt16LE(offset + 4);
    i = 1;
  } else {
    a = data.readInt16LE(offset);
    b = data.readInt16LE(offset + 2);
    c = data.readInt16LE(offset + 4);
    i = 0;
  }
    // Print the data to the console
      // io.emit('data', { x, y, z });
    console.log(`X: ${x}, Y: ${y}, Z: ${z}, RX: ${a}, RY: ${b}, RZ: ${c}, S: ${h}`);
  });

      setInterval (() =>{
    io.emit('data', { x, y, z, a, b, c, h });
      }, 500);

// Listen for error events
device.on('error', err => {
  console.error(err);
});

device.on('error', err => {
  console.error(err);
});

// Serve the static HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
server.listen(3000, () => {
  console.log('Server started on port 3000');
});