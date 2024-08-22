const {
  isMainThread,
  Worker,
  workerData,
  parentPort,
} = require("worker_threads");

if (isMainThread) {
  const makeCountThredFunction = function makeCountThread() {
    const worker = new Worker(__filename, {
      workerData: {
        endCount: 1e10,
      },
    });

    worker.on("message", (count) => console.log("Count:", count));
    worker.on("error", (err) => console.log("Worker error: ", err));
  };

  module.exports = { makeCountThredFunction };
} else {
  const countWoker = workerData;
  let count = 0;
  console.log({ workerData, countWoker });

  while (count < countWoker.endCount) count++;

  parentPort.postMessage(count);
}
