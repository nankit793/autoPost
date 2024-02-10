const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  driveFileId: {
    type: String,
    required: true,
  },
  isFb: {
    type: Boolean,
    default: false,
  },
  isInstagram: {
    type: Boolean,
    default: false,
  },
  isYoutube: {
    type: Boolean,
    default: false,
  },
  uploadedToFb: {
    type: Boolean,
    default: false,
  },
  uploadedToInstagram: {
    type: Boolean,
    default: false,
  },
  uploadedToYoutube: {
    type: Boolean,
    default: false,
  },
  isImage: {
    type: Boolean,
    default: false,
  },
  isReel: {
    type: Boolean,
    default: false,
  },
});

const UrlModel = mongoose.model('revisingSoulz', urlSchema);

module.exports = UrlModel;
