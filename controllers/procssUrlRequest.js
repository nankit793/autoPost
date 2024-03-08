const {
  uploadImageToDrive,
} = require("../uploaders/clients/drive/driveImageUploader");
const {
  uploadtVideoToDrive,
} = require("../uploaders/clients/drive/driveVideoUploader");

const processUrlRequest = async (params) => {
  try {
    const {
      mediaLinks,
      isFb,
      isInstagram,
      isYoutube,
      isImage,
      isReel,
      uploadedToYoutube,
      downURL,
      URLmodel,
      drive,
      title,
    } = params;
    const doc = await URLmodel.findOne({ url: mediaLinks });
    if (doc) {
      return { state: "false", message: "URL already added" };
    }

    let driveFileId;
    if (isImage) {
      uploadedToYoutube = true;
      driveFileId = await uploadImageToDrive(downURL, drive);
    } else if (isReel) {
      driveFileId = await uploadtVideoToDrive(downURL, drive);
    }

    const newUrl = await new URLmodel({
      url: mediaLinks,
      isFb,
      isInstagram,
      isYoutube,
      isImage,
      isReel,
      driveFileId,
      uploadedToYoutube,
      postTitle: title,
    });

    await newUrl.save();

    return { state: true, newUrl };
  } catch (error) {
    return {
      state: false,
      message: error.message || "Server issue, please contact developer",
    };
  }
};
module.exports = { processUrlRequest };
