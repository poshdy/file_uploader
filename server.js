const net = require("node:net");
const fs = require("node:fs/promises");

const server = net.createServer(() => {});

let fileHandler, stream;
server.on("connection", (socket) => {
  console.log("New Connection!");

  socket.on("data", async (data) => {
    if (!fileHandler) {
      socket.pause();
      fileHandler = await fs.open(`./storage/test.txt`, "w");
      stream = fileHandler.createWriteStream();

      stream.write(data);
      
      socket.resume();
      stream.on("drain", () => {
        socket.resume();
      });
    } else {
      if (!stream.write(data)) {
        socket.pause();
      }
    }
  });

  socket.on("end", () => {
    fileHandler.close();
    fileHandler = undefined;
    stream = undefined;
    console.log("Connection ended");
  });
});

server.listen(8080, "::1", () => {
  console.log("Server is Listening on port 8080");
});
