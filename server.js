const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const spacemouse = require("./spacemouse").spaceMouse;
// const { joyStick } = require("./joystick");
// const { ottoBock, calibration, setTreshold, setFilter } = require("./ottobock");
const { touchpad } = require("./touchpad");

let typeGraphic = 4;
const chartLimite = 100;

//delete
ottoBock = {};



let tresholdOttoBock = 0;
let zeroXOttoBock = 0;
let zeroYOttoBock = 0;
let rawX = 0;
let rawY = 0;
let filterOttoBock = 0;
let xGraph = [0, 0];
let yGraph = [0, 0];
let joystickBtnOld = 1;
let btnGraph = 0;

let offset1 = 1;
let offset2 = 1;
// let yGraph[0] = 0;
// let xGraph[1] = 0;
// let yGraph[1] = 0;

setInterval(() => {
  filterOttoBock = ottoBock.filter;
  rawX = ottoBock.rawX;
  rawY = ottoBock.rawY;
  tresholdOttoBock = ottoBock.tresholdOttoBock;
  zeroXOttoBock = ottoBock.zeroXOttoBock;
  zeroYOttoBock = ottoBock.zeroYOttoBock;
  switch (typeGraphic) {
    case 1:
      xGraph[0] = spacemouse.b;
      yGraph[0] = spacemouse.a;
      xGraph[1] = spacemouse.c;
      yGraph[1] = spacemouse.z;
      break;
    case 2:
      xGraph[0] = spacemouse.x;
      yGraph[0] = spacemouse.y;
      xGraph[1] = spacemouse.c;
      yGraph[1] = spacemouse.z;
      break;
    case 3:
      xGraph[0] += spacemouse.b / offset1;
      yGraph[0] += spacemouse.a / offset1;
      xGraph[1] += spacemouse.c / offset2;
      yGraph[1] += spacemouse.z / offset2;
      break;
    case 4:
      xGraph[0] += spacemouse.x / offset1;
      yGraph[0] += spacemouse.y / offset1;
      xGraph[1] += spacemouse.c / offset2;
      yGraph[1] += spacemouse.z / offset2;
      break;
    case 5:
      if (joystickBtnOld === 0 && joystickBtnOld !== joyStick.btn) {
        console.log("btnChange", joystickBtnOld);
        if (btnGraph === 0) {
          btnGraph = 1;
        } else {
          btnGraph = 0;
        }
        console.log(btnGraph);
      }
      joystickBtnOld = joyStick.btn;
      xGraph[0] += joyStick.x / offset1;
      yGraph[0] += joyStick.y / offset1;
      if (btnGraph) {
        xGraph[1] += joyStick.z / offset2;
      } else {
        yGraph[1] += joyStick.z / offset2;
      }

      break;
    case 6:
      xGraph[0] += ottoBock.x / offset1;
      yGraph[0] += ottoBock.y / offset1;
      break;
    case 7:
      xGraph[1] += ottoBock.x / offset2;
      yGraph[1] += ottoBock.y / offset2;
      break;
case 8:
  xGraph[0] += touchpad.x / offset1 ;
  yGraph[0] += -touchpad.y / offset1 ;
break;
case 9:
  xGraph[1] += touchpad.rawx / offset2;
  yGraph[1] += -touchpad.rawy / offset2;
  break;

  }

  for (i = 0; i < 2; i++) {
    if (xGraph[i] > chartLimite) {
      xGraph[i] = chartLimite;
    } else if (xGraph[i] < -chartLimite) {
      xGraph[i] = -chartLimite;
    }
    if (yGraph[i] > chartLimite) {
      yGraph[i] = chartLimite;
    } else if (yGraph[i] < -chartLimite) {
      yGraph[i] = -chartLimite;
    }
  }

  io.emit("data", {
    xGraph,
    yGraph,
    tresholdOttoBock,
    zeroXOttoBock,
    zeroYOttoBock,
    rawX,
    rawY,
    filterOttoBock,
  });

  // console.log(`X: ${xGraph01}, Y: ${yGraph01}, Z: ${xGraph02}, RZ: ${yGraph02}`)
}, 100);

// Listen for error events
// device.on('error', err => {
//   console.error(err);
// });
io.on("connection", (socket) => {
  socket.on("calibrationSignal", () => {
    calibration();
  });
});

io.on("connection", (socket) => {
  socket.on("changeType", (type) => {
    typeGraphic = parseInt(type);
    console.log(type);
  });
});
io.on("connection", (socket) => {
  socket.on("update-offset1", ({ offset1: newOffset1 }) => {
    offset1 = parseInt(newOffset1);
    console.log(`offset1 updated to ${offset1}`);
  });
});
io.on("connection", (socket) => {
  socket.on("update-offset2", ({ offset2: newOffset2 }) => {
    offset2 = parseInt(newOffset2);
    console.log(`offset2 updated to ${offset2}`);
  });
});
io.on("connection", (socket) => {
  socket.on(
    "update-tresholdOttoBock",
    ({ tresholdOttoBock: newTresholdOttoBock }) => {
      //  tresholdOttoBock = parseInt(newTresholdOttoBock);
      newTreshold = parseInt(newTresholdOttoBock);
      setTreshold(newTreshold);
      console.log(`treshold OttoBock update to ${tresholdOttoBock}`);
    }
  );
});

io.on("connection", (socket) => {
  socket.on(
    "update-filterOttoBock",
    ({ filterOttoBock: newFilterOttoBock }) => {
      //  tresholdOttoBock = parseInt(newTresholdOttoBock);
      newFilter = Number(newFilterOttoBock);
      setFilter(newFilter);
      console.log(`Filter OttoBock update to ${newFilter}`);
    }
  );
});

app.use("/css", express.static("css"));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
// Serve the static HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
server.listen(3000, () => {
  console.log("Server started on port 3000");
});

module.exports = { server };
