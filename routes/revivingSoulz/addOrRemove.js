const express = require('express');
const URLmodel = require('../../models/revivingSoluz/URLmodel');
const { uploadtVideoToDrive } = require("../../uploaders/clients/drive/driveVideoUploader");
const { uploadImageToDrive } = require("../../uploaders/clients/drive/driveImageUploader");
const instagramDl = require("@sasmeee/igdl");
const { checkAndRefreshTokens } = require('../../0Authtokens/revivingSoulz/refreshSoulz');
const { google } = require('googleapis');
const app = express();

const checkReqs = async (mediaLinks) => {

  let isFb = false;
  let isInstagram = false;
  let isYoutube = false;
  let isImage = false;
  let isReel = false;
  let downURL = "";
  let uploadedToYoutube = false;


  if (mediaLinks.includes('facebook.com')) {
    isFb = true;
  } else if (mediaLinks.includes('instagram.com')) {
    isInstagram = true;
    const links = await instagramDl(mediaLinks);
    downURL = links[0].download_link
    if (mediaLinks.includes('/reel/')) {
      isReel = true;
    }
    if (mediaLinks.includes('/p/')) {
      isImage = true;
    }
  } else if (mediaLinks.includes('youtube.com')) {
    isYoutube = true;
  }

  return {
    isFb, isInstagram, isYoutube, isImage, isReel, uploadedToYoutube, downURL
  }
}

app.post('/addURL', async (req, res) => {
  const { mediaLinks } = req.body || {};

  if (!mediaLinks) {
    return res.status(401).json({ message: "Need a URL" })
  }

  let { isFb, isInstagram, isYoutube, isImage, isReel, uploadedToYoutube, downURL } = await checkReqs(mediaLinks)

  if (!((isFb || isInstagram || isYoutube) && (isImage || isReel))) {
    return res.status(400).json({ message: "could not understand URL" })
  }

  try {
    const { oAuth2Client } = await checkAndRefreshTokens()
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    let driveFileId;
    if (isImage) {
      uploadedToYoutube = true;
      driveFileId = await uploadImageToDrive(downURL, drive);
    }
    else if (isReel) {
      driveFileId = await uploadtVideoToDrive(downURL, drive);
    }

    const newUrl = new URLmodel({
      url: mediaLinks,
      isFb,
      isInstagram,
      isYoutube,
      isImage,
      isReel,
      driveFileId,
      uploadedToYoutube
    });
    await newUrl.save();
    res.status(201).json({ message: 'URL added successfully', newUrl });
  } catch (error) {
    console.error('Error adding URL:', error);
    res.status(500).json({ error: 'Internal server error' });
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

