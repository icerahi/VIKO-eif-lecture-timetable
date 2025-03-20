// const express = require("express");

// const WebSocket = require("ws");

// const app = express();
// const port = 3000;

// const server = app.listen(port, () => {
//   console.log("Server running on port:", port);
// });

// const wss = new WebSocket.Server({ server });

// wss.on("connection", (ws) => {
//   console.log("a client is connectd.");
//   ws.on("message", (message) => {
//     console.log("Recieved:", message);
//   });

//   setInterval(() => {
//     ws.send(JSON.stringify({ text: "New message from server!" }));
//   }, 5000);
// });

const express = require("express");
const websocket = require("ws");

const app = express();
const port = 3000;

const server = app.listen(3000, () => {
  console.log("Server running on port :", port);
});

const wss = new websocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("A client connected");

  ws.on("message", (message) => {
    console.log("Received:", JSON.parse(message));
  });
  setInterval(() => {
    ws.send(JSON.stringify({ text: "NEw message received!" }));
  }, 2000);
});
