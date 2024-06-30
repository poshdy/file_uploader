const net = require("node:net");
const fs = require("node:fs/promises");

const socket = net.createConnection({ port: 8080, host: "::1" }, async () => {
  const filePath = "./text.txt";
  const fileHandler = await fs.open(filePath, "r");
  const readStream = fileHandler.createReadStream();
  readStream.on("data", (chunk) => {
    if (!socket.write(chunk)) {
      readStream.pause();
    }
  });

  socket.on("drain", () => {
    console.log("drained");
    readStream.resume();
  });

  readStream.on("end", () => {
    fileHandler.close();
    console.log("file successfully uploaded!");
    socket.end();
  });
});
