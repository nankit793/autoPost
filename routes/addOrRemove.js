const express = require("express");
const app = express();
const { addURL } = require("../controllers/socialUrls/addURL");
const { deleteMany } = require("../controllers/socialUrls/deleteMany");
const { Info } = require("../controllers/socialUrls/info");
const { deleteURL } = require("../controllers/socialUrls/removeURL");

const { instances } = require("../assets/socialData");

app.post("/addURL", async (req, res) => {
  try {
    const { url, appId } = req.query || "";
    if (!url) return res.status(401).json({ message: "URL to de bhadwe" });

    if (!appId) return res.status(400).json({ message: "require APP ID" });

    const app = instances[appId];

    if (!app)
      return res.status(401).json({ message: "please, provide valid App ID" });

    const add = await addURL(url, app.name, app.model);

    if (add.state)
      return res
        .status(200)
        .json({ message: add.message || "Success", doc: add?.doc || {} });
    else return res.status(401).json({ message: add.message || "error" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Internal server error, contact developer" });
  }
});

// Endpoint to remove URLs uploaded to every social media platform
app.delete("/clearURL", async (req, res) => {
  try {
    const { appId } = req.query || {};
    if (!appId) return res.status(400).json({ message: "require APP ID" });

    const app = instances[appId];
    if (!app)
      return res.status(401).json({ message: "please, provide valid App ID" });

    const deleter = await deleteMany(app.name, app.model);

    if (deleter.state)
      return res.status(200).json({ message: deleter.message || "Success" });
    else return res.status(401).json({ message: deleter.message || "error" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Internal server error, contact developer" });
  }
});

app.get("/info", async (req, res) => {
  try {
    const { appId } = req.query || {};
    if (!appId) return res.status(400).json({ message: "require APP ID" });

    const app = instances[appId];
    if (!app)
      return res.status(401).json({ message: "please, provide valid App ID" });

    const info = await Info(app.model);

    if (info.state)
      return res
        .status(200)
        .json({ message: info.message || "Success", ...info });
    else return res.status(401).json({ message: info.message || "error" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Internal server error, contact developer" });
  }
});

app.delete("/removeURL", async (req, res) => {
  try {
    const { url, appId } = req.query;
    if (!url) return res.status(401).json({ message: "URL to de bhadwe" });

    const app = instances[appId];
    if (!app)
      return res.status(401).json({ message: "please, provide valid App ID" });

    const deleteMany = await deleteURL(url, app.model, app.name);

    if (deleteMany.state)
      return res.status(200).json({ message: deleteMany.message || "Success" });
    else
      return res.status(401).json({ message: deleteMany.message || "error" });
  } catch (error) {
    res.status(401).json({
      messsage:
        `${error.message}, Contact developer` ||
        "Server Error, Contact developer",
    });
  }
});
module.exports = app;
