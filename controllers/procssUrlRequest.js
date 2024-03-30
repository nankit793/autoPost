const {
  driveCarouselUploader,
} = require("../uploaders/clients/drive/driveCarouselUploader");
const {
  uploadImageToDrive,
} = require("../uploaders/clients/drive/driveImageUploader");
const {
  uploadtVideoToDrive,
} = require("../uploaders/clients/drive/driveVideoUploader");

const processUrlRequest = async (params) => {
  try {
    let uploadedToYoutube = false;
    let uploadedToInstagram = false;
    let uploadedToFb = false;
    let carousalError = "";
    const {
      mediaLinks,
      isFb,
      isInstagram,
      isYoutube,
      isImage,
      isReel,
      downURL,
      URLmodel,
      drive,
      title,
      isCarousel,
    } = params;

    const doc = await URLmodel.findOne({ url: mediaLinks });
    if (doc) {
      if (doc?.isCarousel && doc?.carouselError)
        return { state: "false", message: doc?.carouselError };

      return { state: "false", message: "URL already added" };
    }

    let driveUplaod;
    if (isImage) {
      uploadedToYoutube = true;
      driveUplaod = await uploadImageToDrive(downURL, drive);
    } else if (isReel) {
      driveUplaod = await uploadtVideoToDrive(downURL, drive);
    } else if (isCarousel) {
      uploadedToYoutube = true;
      driveUplaod = await driveCarouselUploader(downURL, drive);
    }

    if (isCarousel && !driveUplaod.state) {
      uploadedToYoutube = true;
      uploadedToInstagram = true;
      uploadedToFb = true;

      if (driveUplaod?.carousalError)
        carousalError =
          "This carousal has a video file in it, please upload carousal with only images";
    }
    const { driveFileId } = driveUplaod;
    const newUrl = await new URLmodel({
      url: mediaLinks,
      isFb,
      isInstagram,
      isYoutube,
      isImage,
      isReel,
      driveFileId,
      uploadedToYoutube,
      uploadedToInstagram,
      uploadedToFb,
      carouselError: carousalError,
      isCarousel,
      postTitle: title,
    });

    await newUrl.save();
    if (!driveUplaod.state) {
      return {
        state: false,
        message: isCarousel
          ? driveUplaod?.message || "Maybe, there is a video file in carosal"
          : driveUplaod?.message || "Contact developer",
      };
    }
    return { state: true, newUrl };
  } catch (error) {
    return {
      state: false,
      message: error.message || "Server issue, please contact developer",
    };
  }
};
module.exports = { processUrlRequest };
