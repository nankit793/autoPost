const instagramDl = require("@sasmeee/igdl");

const checkReqs = async (mediaLinks) => {
  try {
    let isFb = false;
    let isInstagram = false;
    let isYoutube = false;
    let isImage = false;
    let isReel = false;
    let downURL = "";
    let uploadedToYoutube = false;
    let isCarousel = false;

    if (!mediaLinks) {
      return {
        state: false,
        message: "URL Not given",
        isFb,
        isInstagram,
        isYoutube,
        isImage,
        isReel,
        uploadedToYoutube,
        downURL,
      };
    }
    if (mediaLinks.includes("facebook.com")) {
      isFb = true;
    } else if (mediaLinks.includes("instagram.com")) {
      isInstagram = true;

      const links = await instagramDl(mediaLinks);

      if (mediaLinks.includes("/reel/")) {
        downURL = links[0]?.download_link;
        isReel = true;
      }
      if (mediaLinks.includes("/p/")) {
        if (links.length > 1) {
          downURL = links;
          isCarousel = true;
        } else {
          downURL = links[0]?.download_link;
          isImage = true;
        }
      }
    } else if (mediaLinks.includes("youtube.com")) {
      isYoutube = true;
    }

    if (
      !((isFb || isInstagram || isYoutube) && (isImage || isReel || isCarousel))
    ) {
      return {
        state: false,
        message: "Please upload only Reel or Image",
        isFb,
        isInstagram,
        isYoutube,
        isImage,
        isReel,
        uploadedToYoutube,
        downURL,
        isCarousel,
      };
    }

    return {
      isFb,
      isInstagram,
      isYoutube,
      isImage,
      isReel,
      uploadedToYoutube,
      downURL,
      state: true,
      isCarousel,
      message: "Success",
    };
  } catch (error) {
    return { state: false, message: "Error occured, maybe media link is bad" };
  }
};

module.exports = { checkReqs };
