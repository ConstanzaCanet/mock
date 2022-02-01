import { fork } from "child_process";
import express from 'express';

const random = express.Router() 

random.get("/", (req, res) => {
  const cant = parseInt(req.query.cant || 100000000);
  if (isNaN(cant)) {
    res.status(400).send({
      error: "Error type",
    });
    return;
  }
  const random = fork("./apiRandom.js", [cant]);
  random.on("message", (data) => {
    res.json({ iterations: cant, numbers: data });
  });
});

export default random;