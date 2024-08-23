const {
  isMainThread,
  Worker,
  workerData,
  parentPort,
} = require("worker_threads");

const countWoker = workerData;
let count = 0;

console.log("Thread Started");
console.log({ countWoker });

while (count < countWoker.endCount) {
  // CPU Intensive task
  count++;
}

console.log("Finished");

parentPort.postMessage(count);
