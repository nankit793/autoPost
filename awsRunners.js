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
    await generateFbUserToken(
      "f4b3d6ab886f041f78d5b8cc11c0f7d5",
      693336926299891,
      "revivingSoulz"
    );
  },
  {
    timezone: indianTimezone,
  }
);

cron.schedule(
  "0 0 21 * *",
  async () => {
    await generateFbUserToken(
      "f4b3d6ab886f041f78d5b8cc11c0f7d5",
      693336926299891,
      "revivingSoulz"
    );
  },
  {
    timezone: indianTimezone,
  }
);

// cron.schedule(
//   "55 21 * * *",
//   async () => {
//     axios.get("https://autopost-1ah4.onrender.com");
//   },
//   {
//     timezone: indianTimezone,
//   }
// );

// cron.schedule(
//   "55 10 * * *",
//   async () => {
//     axios.get("https://autopost-1ah4.onrender.com");
//   },
//   {
//     timezone: indianTimezone,
//   }
// );

// Start the Express server
