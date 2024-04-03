// const instagramDl = require("@sasmeee/igdl");
const { ndown } = require("nayan-media-downloader");

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

      //   const links = await instagramDl(mediaLinks);

      if (mediaLinks.includes("/reel/")) {
        let links = await ndown(mediaLinks);
        // downURL = links[0]?.download_link;
        downURL = links?.data[0]?.url;
        isReel = true;
      }
      // if (mediaLinks.includes("/p/")) {
      //   if (links?.data?.length > 1) {
      //     // downURL = links;
      //     downURL = links?.data;
      //     isCarousel = true;
      //   } else {
      //     // downURL = links[0]?.download_link;
      //     downURL = links?.data[0]?.url;
      //     isImage = true;
      //   }
      // }
    } else if (mediaLinks.includes("youtube.com")) {
      isYoutube = true;
    }

    if (
      !((isFb || isInstagram || isYoutube) && (isImage || isReel || isCarousel))
    ) {
      return {
        state: false,
        message: "Please upload only Reel",
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
    console.log(error.message);
    return { state: false, message: "Error occured, maybe media link is bad" };
  }
};

module.exports = { checkReqs };
