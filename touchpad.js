const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

let touchpad = {};
touchpad.rawx = 0;
touchpad.rawy = 0;
touchpad.cumulativex = 0;
touchpad.cumulativey = 0;
touchpad.x = 0;
touchpad.y = 0;
touchpad.z = 0;
touchpad.c = 0;
touchpad.btn = null;
touchpad.tresholdTouchpad = 10;
let moved = 0;

const port = new SerialPort({
  path: "COM14",
  baudRate: 115200,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

const parser = new ReadlineParser();
port.pipe(parser);

let data = "";

parser.on("data", (line) => {
  console.log(`Received data: ${line}`);
  data = line;

  if (data.includes("Move:")) {
    moved = 1;
    [touchpad.rawx, touchpad.rawy] = data.split("Move: ")[1].split(", ");
    console.log(`rawx = ${touchpad.rawx}, rawy = ${touchpad.rawy}`);
    touchpad.cumulativex += Number(touchpad.rawx);
    touchpad.cumulativey += Number(touchpad.rawy); 
    console.log(`cumulativex = ${touchpad.cumulativex}, cumulativey = ${touchpad.cumulativey}`);
  }
  if(touchpad.cumulativex < touchpad.tresholdTouchpad && touchpad.cumulativex > - touchpad.tresholdTouchpad){
    touchpad.x = 0;
    }else if(touchpad.cumulativex > 100) {
        touchpad.x = 100;
    }else if(touchpad.cumulativex < -100) {
        touchpad.x = -100;
    } else  {
      touchpad.x = touchpad.cumulativex;
  }
    
if(touchpad.cumulativey < touchpad.tresholdTouchpad && touchpad.cumulativey > - touchpad.tresholdTouchpad){
    touchpad.y = 0;
    }else if(touchpad.cumulativey > 100) {
        touchpad.y = 100;
    }else if(touchpad.cumulativey < -100) {
        touchpad.y = -100;
    }else{
      touchpad.y = touchpad.cumulativey;
  };
    console.log(`x = ${touchpad.x}, y = ${touchpad.y}`);

});

setInterval (() => {
  if(moved === 0){
    touchpad.cumulativex = 0;
    touchpad.cumulativey = 0;
    touchpad.x = 0;
    touchpad.y = 0;
  }
  moved = 0;
}, 500)


port.on("open", () => {
  console.log("Port is open!");
});

port.on("error", (err) => {
  console.error("Error:", err);
});

port.on("close", () => {
  console.log("Port is closed!");
});


module.exports = { touchpad }
