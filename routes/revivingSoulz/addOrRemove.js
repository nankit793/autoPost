const express = require('express');
const URLmodel = require('../../models/revivingSoluz/URLmodel');
const { validateOauthRevivingSoulz } = require('../../0Authtokens/revivingSoulz/refreshSoulz');
const { google } = require('googleapis');
const { checkReqs } = require('../../controllers/urlValidator');
const { processUrlRequest } = require("../../controllers/procssUrlRequest");
const UrlModel = require('../../models/revivingSoluz/URLmodel');
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


const processFiles = (files) => {
  uploadToFBCount = 0
  uploadToYoutubeCount = 0
  numOfReels = 0
  numOfImages = 0
  uploadToInstaCount = 0

  for (let index = 0; index < files.length; index++) {
    const element = files[index];
    if (element.uploadedToFb) {
      uploadToFBCount = uploadToFBCount + 1
    }
    if (element.uploadedToInstagram) {
      uploadToInstaCount = uploadToInstaCount + 1
    }
    if (element.uploadedToYoutube) {
      uploadToYoutubeCount = uploadToYoutubeCount + 1
    }

    if (element.isImage) {
      numOfImages = numOfImages + 1
    }
    else if (element.isReel) {
      numOfReels = numOfReels + 1
    }
  }

  return { uploadToFBCount, uploadToInstaCount, uploadToYoutubeCount, numOfImages, numOfReels }
}
app.get("/info", async (req, res) => {
  try {
    const files = await UrlModel.find()
    const fileInformation = processFiles(files)
    res.status(200).json({ totalURLS: files.length, ...fileInformation })
  } catch (error) {
    return res.json({ message: error.message || "please notify developer" })
  }
})
module.exports = app;

