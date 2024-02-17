const express = require('express');
const URLmodel = require('../../models/revivingSoluz/URLmodel');
const { validateOauthRevivingSoulz } = require('../../0Authtokens/revivingSoulz/refreshSoulz');
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
    const { oAuth2Client } = await validateOauthRevivingSoulz()
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
    const documentsToDelete = await URLmodel.find({
      uploadedToFb: true,
      uploadedToInstagram: true,
      uploadedToYoutube: true,
    })

    const results = await URLmodel.deleteMany({
      uploadedToFb: true,
      uploadedToInstagram: true,
      uploadedToYoutube: true,
    });
    const { oAuth2Client } = await validateOauthRevivingSoulz()
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    console.log(documentsToDelete)
    documentsToDelete.forEach((doc) => {
      drive.files.delete({
        fileId: doc.driveFileId
      }, (err, res) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted:', fileId);
        }
      });
    });
    res.json({ message: `${results.deletedCount} URLs removed` });
  } catch (error) {
    console.error('Error removing URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;

