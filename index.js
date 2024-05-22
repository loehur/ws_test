var server = require("ws").Server;
const PORT = 5001;
var s = new server({ port: PORT });

var user = {};
s.on("connection", function (ws, req) {
  const urlParams = new URLSearchParams(req.url.split("?")[1]);
  const id = urlParams.get("id");
  console.log(urlParams);

  user[id] = ws;

  ws.on("message", (data, isBinary) => {
    console.log("Received: " + data);
    var data = JSON.parse(data);

    if (data.target === "all") {
      s.clients.forEach(function e(client) {
        client.send(data.text, { binary: isBinary });
      });
    } else if (data.target === "all_xme") {
      s.clients.forEach(function e(client) {
        if (client !== ws) {
          client.send(data.text, { binary: isBinary });
        }
      });
    } else {
      if (typeof user[data.target] !== "undefined") {
        user[data.target].send(data.text, { binary: isBinary });
      } else {
        ws.send("id undefined", { binary: isBinary });
      }
    }
  });

  ws.on("close", function () {
    delete user[id];
    console.log("disconnected: " + id);
  });
});

console.log("WebSocket running on port: " + PORT);