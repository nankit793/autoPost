const axios = require("axios");
const userTokenModel = require("../../models/userTokens");
const readline = require("readline");
const returnFbAccessToken = async (pageName) => {
  let doc = await userTokenModel.findOne({ pageName });
  if (!doc || !doc?.token) {
    doc = userTokenModel({ pageName });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const code = await new Promise((resolve) => {
      rl.question(
        `Enter long lived user access token for ${pageName}: `,
        (userInput) => {
          resolve(userInput);
          rl.close();
        }
      );
    });
    doc.token = code;
    await doc.save();
  }
  return { state: true, token: doc.token || null };
};

module.exports = { returnFbAccessToken };
