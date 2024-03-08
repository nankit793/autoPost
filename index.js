require("./db");
const express = require("express");
const cron = require("node-cron");
var bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const cors = require("cors");
require("./runServer");
const { initiateUploader } = require("./uploaders/mediaHandlers");
const {
  generateFbUserToken,
} = require("./controllers/tokens/generateFbUserToken");

// Google Drive API configuration
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// const corsOptions = {
//   origin: "http://localhost:3001", // Allow only requests from this origin
//   methods: ["GET", "POST"], // Allow only GET and POST requests
//   allowedHeaders: ["Content-Type", "Authorization"], // Allow only specific headers
// };
const corsOptions = {
  origin: "https://autoposting.netlify.app", // Allow only requests from this origin
  methods: ["GET", "POST"], // Allow only GET and POST requests
  allowedHeaders: ["Content-Type", "Authorization"], // Allow only specific headers
};

// Use CORS middleware with options
app.use(cors(corsOptions));

app.use(bodyParser.json());
const indianTimezone = "Asia/Kolkata";

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
  "0 22 * * *",
  async () => {
    await initiateUploader();
  },
  {
    timezone: indianTimezone,
  }
);

// token generators
// cron.schedule('0 0 10 * *', async () => {
//   await generateFbUserToken("f4b3d6ab886f041f78d5b8cc11c0f7d5", 693336926299891, "revivingSoulz")
// }, {
//   timezone: indianTimezone
// });

// cron.schedule('0 0 21 * *', async () => {
//   await generateFbUserToken("f4b3d6ab886f041f78d5b8cc11c0f7d5", 693336926299891, "revivingSoulz")
// }, {
//   timezone: indianTimezone
// });

// Start the Express server

app.get("/", (req, res) => {
  res.send("Hello, this is your Express server!");
});

app.use("/api", require("./routes/index"));
app.listen(PORT, () => {
  console.log(`Server is running`);
});
