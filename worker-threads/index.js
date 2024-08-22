const express = require("express");
const app = express();
const crypto = require("crypto");
const { makeCountThredFunction } = require("./makeCountThread");

app.get("/makeCalculation", (req, res) => {
  makeCountThredFunction();
  makeCountThredFunction();

  res.send("Hi there");
});

app.listen(3000, () => {
  console.log("App runing on port 3000");
});
