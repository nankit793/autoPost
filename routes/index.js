const express = require('express');
const app = express();

app.use('/app', require("./addOrRemove"));

module.exports = app;
