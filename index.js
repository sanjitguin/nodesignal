// signaling-server.js

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

const peers = new Map();

wss.on("connection", (ws) => {
  let userId = null;

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "join":
        userId = data.userId;
        peers.set(userId, ws);
        console.log(`${userId} joined.`);
        break;

      case "offer":
      case "answer":
      case "candidate":
        const recipient = peers.get(data.to);
        if (recipient) {
          recipient.send(JSON.stringify({
            type: data.type,
            from: userId,
            payload: data.payload,
          }));
        }
        break;
    }
  });

  ws.on("close", () => {
    if (userId && peers.has(userId)) {
      peers.delete(userId);
      console.log(`${userId} disconnected.`);
    }
  });
});

console.log("WebRTC signaling server started on ws://localhost:8080");
console.log("Message from", data.userId, "to", data.targetId, ":", data.type);
