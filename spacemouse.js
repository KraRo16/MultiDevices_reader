const HID = require("node-hid");

// Find the device path of the SpaceMouse Compact
const devices = HID.devices();
const devicePath = devices.find((d) => d.product === "SpaceMouse Compact").path;

// Open the device
const device = new HID.HID(devicePath);
let spaceMouse = {};

spaceMouse.x = 0;
spaceMouse.y = 0;
spaceMouse.z = 0;
spaceMouse.a = 0;
spaceMouse.b = 0;
spaceMouse.c = 0;

let i = 0;

// Listen for data events
device.on("data", (data) => {
  const offset = 1;

  if (i === 0) {
    spaceMouse.x = data.readInt16LE(offset) / 3.5;
    spaceMouse.y = -data.readInt16LE(offset + 2) / 3.5;
    spaceMouse.z = -data.readInt16LE(offset + 4) / 3.5;
    i = 1;
  } else {
    spaceMouse.a = -data.readInt16LE(offset) / 3.5;
    spaceMouse.b = -data.readInt16LE(offset + 2) / 3.5;
    spaceMouse.c = data.readInt16LE(offset + 4) / 3.5;
    i = 0;
  }

});

device.on("error", (err) => {
  console.error(err);
});

module.exports = {spaceMouse};

// setInterval(() => {
// //   console.log(module)
//     console.log(`X: ${x}, Y: ${y}, Z: ${z}, RX: ${a}, RY: ${b}, RZ: ${c} T`);

// }, 1000)

