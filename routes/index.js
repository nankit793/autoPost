const express = require("express");
const adminVerification = require("../controllers/authTokens/authentication");
const app = express();

app.use("/app", adminVerification, require("./addOrRemove"));
app.use("/user", require("./login"));

module.exports = app;
