const express = require('express');
const app = express();

app.use('/revivingSoulz', require("./revivingSoulz/addOrRemove"));

module.exports = app;
