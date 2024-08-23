const express = require("express");
const app = express();
const crypto = require("crypto");
const {
  isMainThread,
  Worker,
  workerData,
  parentPort,
} = require("worker_threads");

function makeCalcultionInOtherThread(count) {
  const promise = new Promise((resolve, reject) => {
    const worker = new Worker("./worker-threads/makeCountThread.js", {
      workerData: {
        endCount: count,
      },
    });

    worker.on("message", (count) => resolve(count));
    worker.on("error", (err) => reject(err));
  });

  return promise;
}

async function doOtherWorkOnEventLoop(maxCount) {
  console.log("Other Work event loop", { maxCount });
  let count = 0;
  while (count < maxCount) count++;

  console.log("Finished work");

  return count;
}

app.get("/makeCalculationWithThreads", async (req, res) => {
  console.log("Request received on /makeCalculationWithThreads");

  const [countNumber, countNumber2] = await Promise.all([
    makeCalcultionInOtherThread(10e8),
    makeCalcultionInOtherThread(10e9),
    makeCalcultionInOtherThread(10e5),
    makeCalcultionInOtherThread(10e7),
  ]);

  doOtherWorkOnEventLoop(10e2);

  res.send(`Hi there, countNUmber: ${countNumber}, ${countNumber2}`);
});

app.get("/makeCalculationOnMainThread", async (req, res) => {
  console.log("Request received on /makeCalculationOnMainThread");

  doOtherWorkOnEventLoop(10e3);

  const [countNumber, countNumber2] = await Promise.all([
    doOtherWorkOnEventLoop(10e8),
    doOtherWorkOnEventLoop(10e9),
    doOtherWorkOnEventLoop(10e5),
    doOtherWorkOnEventLoop(10e7),
  ]);

  doOtherWorkOnEventLoop(10e2);

  res.send(`Hi there, countNumber: ${countNumber}, ${countNumber2}`);
});

app.listen(3000, () => {
  console.log("App runing on port 3000");
});
