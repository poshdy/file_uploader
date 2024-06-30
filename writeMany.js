const fs = require("node:fs/promises");

(async () => {
  console.time("writeMany");
  const fileHandler = await fs.open("./text.txt", "w");
  const stream = fileHandler.createWriteStream();
  let i = 0;
  let NUM_OF_WRITES = 1000000;
  const writeMany = () => {
    while (i < NUM_OF_WRITES) {
      const buff = Buffer.from(` ${i} `, "utf-8");
      if (i === NUM_OF_WRITES - 1) {
        return stream.end(buff);
      }
      if (!stream.write(buff)) break;
      i++;
    }
  };
  writeMany();
  stream.on("drain", () => {
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
    fileHandler.close();
  });
})();
