const https = require("https");

const start = Date.now();
function doRequest() {
  https.get("https://google.com", (res) => {
    res.on("data", () => {});
    res.on("close", () => {
      console.log("Time:", Date.now() - start);
    });
  });
}

doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
