var server = require("ws").Server;
var s = new server({ port: 5001 });

s.on("connection", function (ws) {
  ws.onopen = () => ws.send("Connected");
  ws.on("message", (res, isBinary) => {
    console.log("msg: " + res);
    ws.send(res, { binary: isBinary });
  });
});
