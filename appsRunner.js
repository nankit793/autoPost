const cron = require("node-cron");
const axios = require("axios");
const { initiateUploader, removeURLS } = require("./uploaders/mediaHandlers");

const indianTimezone = "Asia/Kolkata";

cron.schedule(
  "0 10 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);

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
  "0 12 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "0 13 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "0 14 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "0 15 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "0 16 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "0 17 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "0 18 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "0 19 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "0 20 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);

cron.schedule(
  "0 5 * * *",
  async () => {
    // await removeURLS();
  },
  {
    timezone: indianTimezone,
  }
);
