const https = require("https");
const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
function doRequest() {
  https.get("https://google.com", (res) => {
    res.on("data", () => {});
    res.on("close", () => {
      console.log("Time Request:", Date.now() - start);
    });
  });
}

function doHash() {
  crypto.pbkdf2("passs", "salt", 100000, 512, "sha512", () => {
    console.log("Hash:", Date.now() - start);
  });
}

doRequest();

fs.readFile("multitask.ks", "utf-8", () => {
  console.log("fs:", Date.now() - start);
});

doHash();
doHash();
doHash();
doHash();
