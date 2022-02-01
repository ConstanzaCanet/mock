import express from 'express';


const infoRouter =express.Router();

infoRouter.get("/", (req, res) => {
  const info = {
    argv: process.argv,
    execPath: process.execPath,
    platform: process.platform,
    processId: process.pid,
    version: process.version,
    projectDir: process.cwd(),
    reservedMemory: process.memoryUsage().rss,
  };
  console.log(info)
  res.send(info);
});

export default infoRouter;