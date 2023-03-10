
// const HID = require('node-hid');
// const express = require('express');
// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// const path = require('path');


// // Find the device path of the SpaceMouse Compact
// const devices = HID.devices();
// const devicePath = devices.find(d => d.product === 'SpaceMouse Compact').path;

// // Open the device
// const device = new HID.HID(devicePath);

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname + '/index.html'));
// });



// // Listen for data events
// device.on('data', data => {
//   console.log(`Received data of length ${data.length}`);
//   const offset = 0;
//   const x = data.readInt16LE(offset);
//   const y = data.readInt16LE(offset + 2);
//   const z = data.readInt16LE(offset + 4);
//   // const a = data.readInt8LE(offset + 6);
  
//   // Print the data to the console
//   console.log(`X: ${x}, Y: ${y}, Z: ${z}`);
// });

// // Listen for error events
// device.on('error', err => {
//   console.error(err);
// });


const HID = require('node-hid');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
// const io = require('socket.io')(server);
const path = require('path');


// Find the device path of the SpaceMouse Compact
const devices = HID.devices();
const devicePath = devices.find(d => d.product === 'SpaceMouse Compact').path;

// Open the device
const device = new HID.HID(devicePath);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Listen for data events
device.on('data', data => {
  console.log(`Received data of length ${data.length}`);
  const offset = 0;
  const x = data.readInt16LE(offset);
  const y = data.readInt16LE(offset + 2);
  const z = data.readInt16LE(offset + 4);

  // Print the data to the console
  console.log(`X: ${x}, Y: ${y}, Z: ${z}`);

 
});

// Listen for error events
device.on('error', err => {
  console.error(err);
});


// Start server
server.listen(3000, () => {
  console.log('Server started on port 3000');
});