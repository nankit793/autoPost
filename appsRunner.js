const cron = require("node-cron");
const axios = require("axios");
const { initiateUploader } = require("./uploaders/mediaHandlers");

const indianTimezone = "Asia/Kolkata";
cron.schedule(
  "0 11 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);

cron.schedule(
  "0 22 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);
