import * as cron from "node-cron";
import {poll} from "./poller";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let currentLatestCommitTime = new Date().toISOString();
let running = false;

cron.schedule("*/5 * * * * *", async () => {
  if (running)
  {
    return;
  }

  running = true;
  console.log(`Running population task ${currentLatestCommitTime}`);

  var res = await poll(currentLatestCommitTime);
  if (res != null) {
    console.log(res);
    currentLatestCommitTime = res;
  }  
  running = false;

});