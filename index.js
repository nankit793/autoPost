require("./db")
const express = require('express');
const cron = require('node-cron');
var bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const { uploadToRevivingSoulz } = require('./uploaders/mediaHandlers/revivingSoulz');
const { generateFbUserToken } = require("./controllers/generateFbUserToken");

// Google Drive API configuration
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
cron.schedule('15 22 * * *', async () => {
  console.log("entered the process")
  await uploadToRevivingSoulz()
});

cron.schedule('0 11 * * *', async () => {
  await uploadToRevivingSoulz()
});


//token generators
cron.schedule('0 0 10 * *', async () => {
  await generateFbUserToken("f4b3d6ab886f041f78d5b8cc11c0f7d5", 693336926299891, "revivingSoulz")
});

// Start the Express server
app.get('/', (req, res) => {
  res.send('Hello, this is your Express server!');
});


app.use('/api', require("./routes/index"));
app.listen(PORT, () => {
  console.log(`Server is running`);
});


