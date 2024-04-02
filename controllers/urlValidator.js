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

      const links = await l(mediaLinks);

      downURL = links[0]?.download_link;
      if (mediaLinks.includes("/reel/")) {
        isReel = true;
      }
      if (mediaLinks.includes("/p/")) {
        // support will be added later
        // isImage = true;
      }
    } else if (mediaLinks.includes("youtube.com")) {
      isYoutube = true;
    }

    if (!((isFb || isInstagram || isYoutube) && (isImage || isReel))) {
      return {
        state: false,
        message: "Please upload only reel",
        isFb,
        isInstagram,
        isYoutube,
        isImage,
        isReel,
        uploadedToYoutube,
        downURL,
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
      message: "Success",
    };
  } catch (error) {
    console.log(error);
    return { state: false, message: "Error occured, maybe media link is bad" };
  }
};

module.exports = { checkReqs };
