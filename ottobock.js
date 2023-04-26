const spi = require('spi-device');
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);



let ottoBock = {};
ottoBock.x = 0;
ottoBock.y = 0;

//let calibrationValueOttoBock = 2050;
ottoBock.filter = 0.25;
ottoBock.rawX = 0;
ottoBock.rawY = 0;
ottoBock.zeroXOttoBock = 2050;
ottoBock.zeroYOttoBock = 2050;
ottoBock.tresholdOttoBock = 2;

const calibration = () => {
    ottoBock.zeroXOttoBock = ottoBock.rawX;
    ottoBock.zeroYOttoBock = ottoBock.rawY;
    console.log("I'm alive")
    console.log(ottoBock.zeroXOttoBock);
}

const setTreshold = (newTreshold) =>{
    ottoBock.tresholdOttoBock = newTreshold;
}

const setFilter = (newFilter) => {
    ottoBock.filter = newFilter;
}

const config = {
    mode: 1,
    chipSelect: 0,
    maxSpeedHz: 1000000,
    bitOrder: spi.ORDER_MSB_FIRST,
    bitsPerWord: 8,
}


const device = spi.open(0, 0, config, err => {
  if (err) throw err;
    console.log('SPI device opened');
    
    setInterval(() => {
    

    
    const message = [{
    sendBuffer: Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]), 
    receiveBuffer: Buffer.alloc(7), 
    byteLength: 7,
    speedHz: 100000
     
  }];
//if(device) {
  device.transfer(message, (err, message) => { 
      if (err) throw err;
        



      ottoBock.rawY = ottoBock.rawY*(1 - ottoBock.filter) + ottoBock.filter * ((message[0].receiveBuffer[2] << 8) + message[0].receiveBuffer[3]);
      ottoBock.rawX = ottoBock.rawX*(1 - ottoBock.filter) + ottoBock.filter * ((message[0].receiveBuffer[4] << 8) + message[0].receiveBuffer[5]);


         ottoBock.x = (ottoBock.rawX - ottoBock.zeroXOttoBock) / 4.5;
         ottoBock.y = -(ottoBock.rawY - ottoBock.zeroYOttoBock) / 4.5;
 

        if(ottoBock.x < ottoBock.tresholdOttoBock && ottoBock.x > - ottoBock.tresholdOttoBock){
            ottoBock.x = 0;
            }else if(ottoBock.x > 100) {
                ottoBock.x = 100;
            }else if(ottoBock.x < -100) {
                ottoBock.x = -100;
            };
            
        if(ottoBock.y < ottoBock.tresholdOttoBock && ottoBock.y > - ottoBock.tresholdOttoBock){
            ottoBock.y = 0;
            }else if(ottoBock.y > 100) {
                ottoBock.y = 100;
            }else if(ottoBock.y < -100) {
                ottoBock.y = -100;
            };
 
 
//   console.log(message[0].receiveBuffer)
    
//        console.log(`Fifth Value: ${ottoBock.x}`);
//        console.log(`Sixth Value: ${ottoBock.y}`);
//console.log(`Zero X: ${ottoBock.zeroXOttoBock}`);
//console.log(`Treshold: ${ottoBock.tresholdOttoBock}`)

    })

  },10);
});

//io.on('newInput', (data) => {
//  // Update the values in ottoBock
//  ottoBock.tresholdOttoBock = data.tresholdOttoBock;
//  ottoBock.zeroXOttoBock = data.zeroXOttoBock;
//  ottoBock.zeroYOttoBock = data.zeroYOttoBock;
//});


module.exports = { ottoBock, calibration, setTreshold, setFilter }
