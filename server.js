const net = require("node:net");
const fs = require("node:fs/promises");

const server = net.createServer(() => {});

let fileHandler, stream;
server.on("connection", (socket) => {
  console.log("New Connection!");

  socket.on("data", async (data) => {
    if (!fileHandler) {
      socket.pause();

      const indexOfDivider = data.indexOf("-------");
      const fileName = data.subarray(10, indexOfDivider).toString("utf-8");
      console.log(fileName);
      fileHandler = await fs.open(`./storage/${fileName}`, "w");
      stream = fileHandler.createWriteStream();

      stream.write(data.subarray(indexOfDivider + 7));

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
