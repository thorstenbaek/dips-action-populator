import * as cron from "node-cron";
import {poll} from "./poller";
import SmartEhrClient from "./repositories/SmartEhrClient";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let currentLatestCommitTime = new Date().toISOString();

cron.schedule("*/5 * * * * *", async () => {
  console.log(`Running population task ${currentLatestCommitTime}`);

  var res = await poll(currentLatestCommitTime);
  if (res != null) {
    console.log(res);
    currentLatestCommitTime = res;
  }  
});