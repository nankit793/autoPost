const express = require("express");
const {
  generateRefreshToken,
} = require("../controllers/authTokens/generateTokens");
const authTokenModel = require("../models/authTokens");
const { userData } = require("../assets/socialData");

const app = express();

app.post("/login", async (req, res) => {
  const { userid, password } = req.body;
  const user = userData[userid];
  if (!user) {
    return res.status(401).json({ state: false, message: "Wrong, user id" });
  }
  if (user.password != password) {
    return res.status(401).json({ state: false, message: "Wrong Password" });
  }

  const token = await generateRefreshToken({ userid });

  let dbUser = await authTokenModel.findOne({ userid });
  if (!dbUser) {
    dbUser = await authTokenModel({ userid });
  }
  dbUser.token = token;
  await dbUser.save();

  return res.status(200).json({
    state: true,
    message: "login success",
    controlledApps: user.apps,
    token,
  });
});

module.exports = app;
