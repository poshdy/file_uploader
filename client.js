const net = require("node:net");
const fs = require("node:fs/promises");
const path = require("node:path");
const socket = net.createConnection({ port: 8080, host: "::1" }, async () => {
  const filePath = process.argv[2];
  const fileName = path.basename(filePath);
  const fileHandler = await fs.open(filePath, "r");
  const readStream = fileHandler.createReadStream();

  socket.write(`fileName: ${fileName}-------`);

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
