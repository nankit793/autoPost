require("./db");
const express = require("express");
const cron = require("node-cron");
var bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const cors = require("cors");
// require("./appsRunner");
// require("./awsRunners");

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

app.get("/", (req, res) => {
  res.send("Hello, this is your Express server!");
});

app.use("/api", require("./routes/index"));
app.listen(PORT, () => {
  console.log(`Server is running`);
});
