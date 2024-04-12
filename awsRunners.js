const cron = require("node-cron");
const axios = require("axios");
const {
  generateFbUserToken,
} = require("./controllers/tokens/generateFbUserToken");

const indianTimezone = "Asia/Kolkata";
// token generators
cron.schedule(
  "0 0 10 * *",
  async () => {
    await generateFbUserToken();
  },
  {
    timezone: indianTimezone,
  }
);

cron.schedule(
  "0 0 21 * *",
  async () => {
    await generateFbUserToken();
  },
  {
    timezone: indianTimezone,
  }
);

cron.schedule(
  "55 15 * * *",
  async () => {
    await axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);

cron.schedule(
  "55 16 * * *",
  async () => {
    await axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "55 17 * * *",
  async () => {
    await axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "55 18 * * *",
  async () => {
    await axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "55 19 * * *",
  async () => {
    await axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "55 20 * * *",
  async () => {
    await axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "55 10 * * *",
  async () => {
    await axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "55 11 * * *",
  async () => {
    await axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "55 12 * * *",
  async () => {
    await axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "55 13 * * *",
  async () => {
    await axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);
cron.schedule(
  "55 14 * * *",
  async () => {
    await axios.get("https://autopost-1ah4.onrender.com");
  },
  {
    timezone: indianTimezone,
  }
);

// // Start the Express server
