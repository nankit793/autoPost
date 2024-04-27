const URlmodelStruc = {
  url: {
    type: String,
    required: true,
    unique: true,
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
  isCarousel: {
    type: Boolean,
    default: false,
  },
  carouselError: {
    type: String,
    default: "",
  },
  // tags: {type: Array, default: [] },
  postTitle: { type: String },
  postTags: { type: String },
};
module.exports = { URlmodelStruc };
