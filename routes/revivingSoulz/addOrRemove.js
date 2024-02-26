const express = require('express');
const URLmodel = require('../../models/revivingSoluz/URLmodel');
const { validateOauthRevivingSoulz } = require('../../0Authtokens/revivingSoulz/refreshSoulz');
const { google } = require('googleapis');
const { checkReqs } = require('../../controllers/urlValidator');
const { processUrlRequest } = require("../../controllers/procssUrlRequest");
const UrlModel = require('../../models/revivingSoluz/URLmodel');
const { deleteDocsFromDrive } = require('../../controllers/deleteDocsFromDrive');
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
      return res.status(200).json({ message: 'URL added successfully', doc: processReq.newUrl });
    }
    else {
      res.status(401).json({ message: processReq.message || "server error, contact developer" })
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
    await deleteDocsFromDrive(documentsToDelete, drive)

    res.json({ message: `${results.deletedCount} URLs removed` });
  } catch (error) {
    console.error('Error removing URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const processFiles = (files) => {
  uploadToFBCount = 0
  uploadToYoutubeCount = 0
  notUploadedToInstaUrls = []
  notUploadedToYoutubeUrls = []
  notUploadedToFbUrls = []
  numOfReels = 0
  numOfImages = 0
  uploadToInstaCount = 0
  notUploadedAnywhereUrls = []
  for (let index = 0; index < files.length; index++) {
    const element = files[index];
    if (element.uploadedToFb) {
      uploadToFBCount = uploadToFBCount + 1
    }
    else {
      notUploadedToFbUrls.push(element.url)
    }
    if (element.uploadedToInstagram) {
      uploadToInstaCount = uploadToInstaCount + 1
    }
    else {
      notUploadedToInstaUrls.push(element.url)
    }
    if (element.uploadedToYoutube) {
      uploadToYoutubeCount = uploadToYoutubeCount + 1
    }
    else {
      notUploadedToYoutubeUrls.push(element.url)
    }
    if (!element.uploadedToFb && !element.uploadedToInstagram && !element.uploadedToYoutube) {
      notUploadedAnywhereUrls.push(element.url)
    }
    if (element.isImage) {
      numOfImages = numOfImages + 1
    }
    else if (element.isReel) {
      numOfReels = numOfReels + 1
    }
  }

  return {
    uploadCounts: { uploadToFBCount, uploadToInstaCount, uploadToYoutubeCount },
    notUploadedAnywhereUrls,
    notUploadedUrls: {
      notUploadedToFbUrls, notUploadedToInstaUrls, notUploadedToYoutubeUrls
    },
    numOfImages, numOfReels
  }
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

app.delete("/removeURL", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(401).json({ message: "URL to de bhadwe" })
    }

    const element = await URLmodel.findOne({ url })
    if (!element) {
      return res.status(401).json({ message: "URL to theek dede" })
    }

    if (!element.uploadedToFb && !element.uploadedToInstagram && !element.uploadedToYoutube) {
      doc = await UrlModel.findOneAndDelete({ url })
      const { oAuth2Client } = await validateOauthRevivingSoulz()
      const drive = google.drive({ version: 'v3', auth: oAuth2Client });
      await deleteDocsFromDrive([doc], drive)
      return res.status(200).json({ mesage: "Kardiya delete" })
    }
    else {
      return res.status(401).json({ message: "seems like url is uploaded in at least one social media, contact developer" })
    }

  } catch (error) {
    res.status(401).json({ messsage: error.message })
  }
})
module.exports = app;

