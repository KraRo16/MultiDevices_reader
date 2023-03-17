const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");
const spacemouse = require("./spacemouse").spaceMouse;

let typeGraphic = 4;
const chartLimite = 100;

let xGraph = [0, 0];
let yGraph = [0, 0];
let offset1 = 10;
let offset2 = 5;
// let yGraph[0] = 0;
// let xGraph[1] = 0;
// let yGraph[1] = 0;


setInterval(() => {
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

  io.emit("data", { xGraph, yGraph });

  // console.log(`X: ${xGraph01}, Y: ${yGraph01}, Z: ${xGraph02}, RZ: ${yGraph02}`)
}, 100);

// Listen for error events
// device.on('error', err => {
//   console.error(err);
// });

io.on('connection', (socket) => {
  socket.on('changeType', (type) => {
    typeGraphic = parseInt(type);
    console.log(type)
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
app.use("/css", express.static("css"));
// Serve the static HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
server.listen(3000, () => {
  console.log("Server started on port 3000");
});
