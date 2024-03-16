const cron = require("node-cron");
const axios = require("axios");

const indianTimezone = "Asia/Kolkata";
cron.schedule(
  "55 21 * * *",
  async () => {
    axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);

cron.schedule(
  "55 10 * * *",
  async () => {
    axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);
