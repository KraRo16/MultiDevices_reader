const spi = require('spi-device');

let joyStick = {};

joyStick.x = 0;
joyStick.y = 0;
joyStick.z = 0;
joyStick.btn = 0;

let calibrationValueJoyStick = 2050;



const config = {
    mode: 0,
    chipSelect: 0,
    maxSpeedHz: 1000000,
    bitOrder: spi.ORDER_MSB_FIRST,
    bitsPerWord: 8,
}


const device = spi.open(1, 0, config,  err => {
  if (err) throw err;
    console.log('SPI device opened');
    
    setInterval(() => {
    const message = [{
    sendBuffer: Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A]), 
    receiveBuffer: Buffer.alloc(10), 
    byteLength: 10,
    speedHz: 100000
     
  }];

  device.transfer(message, (err, message) => {
      if (err) throw err;
      
         joyStick.x = (message[0].receiveBuffer[2] << 8) + message[0].receiveBuffer[3];
         joyStick.y = (message[0].receiveBuffer[4] << 8) + message[0].receiveBuffer[5];
         joyStick.z = (message[0].receiveBuffer[6] << 8) + message[0].receiveBuffer[7];
         joyStick.btn = message[0].receiveBuffer[8]


         joyStick.x = (joyStick.x - calibrationValueJoyStick) / 20.5;
         joyStick.y = (joyStick.y - calibrationValueJoyStick) / 20.5;
         joyStick.z = (joyStick.z - calibrationValueJoyStick) / 20.5;


 
         if(joyStick.x < 10 && joyStick.x > - 10){
            joyStick.x = 0;
            } else if(joyStick.x > 100) {
                joyStick.x = 100;
            };
            
        if(joyStick.y < 10 && joyStick.y > - 10){
            joyStick.y = 0;
            }else if(joyStick.y > 100) {
                joyStick.y = 100;
            };
        if(joyStick.z < 10 && joyStick.z > - 10){
            joyStick.z = 0;
            }else if(joyStick.z > 100) {
                joyStick.z = 100;
            };


 
 
//   console.log(message[0].receiveBuffer)
    
//        console.log(`First Value: ${joyStick.x}`);
//        console.log(`Second Value: ${joyStick.y}`);
//        console.log(`Third Value: ${joyStick.z}`);
//        console.log(`BTN: ${joyStick.btn}`);


    })
        
  },10);
});

module.exports = {joyStick}






