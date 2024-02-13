const express = require('express');
const URLmodel = require('../../models/revivingSoluz/URLmodel');
const { checkAndRefreshUserTokens } = require('../../0Authtokens/revivingSoulz/refreshSoulz');
const { google } = require('googleapis');
const { checkReqs } = require('../../controllers/urlValidator');
const { processUrlRequest } = require("../../controllers/procssUrlRequest")
const app = express();

app.post('/addURL', async (req, res) => {
  const { mediaLinks } = req.body || {};
  let { state, message, isFb, isInstagram, isYoutube, isImage, isReel, uploadedToYoutube, downURL } = await checkReqs(mediaLinks)
  if (!state) {
    return res.status(400).json({ message: message || "Please contact developer" })
  }

  try {
    const { oAuth2Client } = await checkAndRefreshUserTokens()
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const params = { mediaLinks, isFb, isInstagram, isYoutube, isImage, isReel, uploadedToYoutube, downURL, URLmodel, drive }
    const processReq = await processUrlRequest(params)

    if (processReq && processReq.state && processReq.newUrl) {
      return res.status(201).json({ message: 'URL added successfully', doc: processReq.newUrl });
    }

  } catch (error) {
    console.error('Error adding URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to remove URLs uploaded to every social media platform
app.delete('/urls/delete', async (req, res) => {
  try {
    const result = await URLmodel.deleteMany({
      uploadedToFb: true,
      uploadedToInstagram: true,
      uploadedToYoutube: true,
    });

    res.json({ message: `${result.deletedCount} URLs removed` });
  } catch (error) {
    console.error('Error removing URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;

