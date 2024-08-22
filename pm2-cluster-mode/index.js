const express = require("express");
const app = express();
const crypto = require("crypto");

function doWork(interval) {
  const start = Date.now();
  while (Date.now() - start < interval) {
    console.log("CPU Intensive task");
  }
}

app.get("/", (req, res) => {
  doWork(5000);

  res.send("Hi there");
});

app.get("/fast", (req, res) => {
  res.send("That was fast");
});

app.get("/crypto", (req, res) => {
  crypto.pbkdf2("passs", "salt", 100000, 512, "sha512", () => {
    res.send("Hashed");
  });
});

app.listen(3000, () => {
  console.log("App runing on port 3000");
});
