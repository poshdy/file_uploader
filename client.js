const net = require("node:net");
const fs = require("node:fs/promises");
const path = require("node:path");

const socket = net.createConnection({ port: 8080, host: "::1" }, async () => {
  const filePath = process.argv[2];
  const fileName = path.basename(filePath);

  const fileHandler = await fs.open(filePath, "r");
  const readStream = fileHandler.createReadStream();
  
  const fileSize = (await fileHandler.stat()).size;

  let uploadedPercentage = 0;
  let bytesUploaded = 0;

  socket.write(`fileName: ${fileName}-------`);
  console.log();
  readStream.on("data", async (chunk) => {
    if (!socket.write(chunk)) {
      readStream.pause();
    }

    bytesUploaded += chunk.length;
    let Percentage = Math.floor((bytesUploaded / fileSize) * 100);

    if (Percentage !== uploadedPercentage) {
      uploadedPercentage = Percentage;

      await GoLineUp(0, -1);
      await ClearLine(0);
      console.log(`Uploading.. ${uploadedPercentage}%`);
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

function ClearLine(dir) {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
}
function GoLineUp(dx, dy) {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
}
