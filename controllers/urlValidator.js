const instagramDl = require("@sasmeee/igdl");

const ytdl = require("ytdl-core");
const axios = require("axios");

async function getYoutubeDownloadLink(videoUrl) {
  try {
    const info = await ytdl.getInfo(videoUrl);
    console.log(info);
    const format = ytdl.chooseFormat(info.formats, {
      quality: "highestvideo",
    });

    const response = await axios.head(format?.url);
    const size = parseInt(response.headers["content-length"]) / (1024 * 1024);
    console.log(size);
    if (size >= 150) {
      return { state: false, message: "File is too large" };
    }
    return { state: true, downURL: format.url };
  } catch (error) {
    console.log(error);
    return { state: false, message: "Could not download file" };
  }
}

const checkReqs = async (mediaLinks) => {
  try {
    let isFb = false;
    let isInstagram = false;
    let isYoutube = false;
    let isImage = false;
    let isReel = false;
    let downURL = "";

    let isVideo = false;

    if (!mediaLinks) {
      return {
        state: false,
        message: "URL Not given",
      };
    }
    if (mediaLinks.includes("facebook.com")) {
      isFb = true;
    } else if (mediaLinks.includes("instagram.com")) {
      isInstagram = true;

      const links = await instagramDl(mediaLinks);

      downURL = links[0]?.download_link;
      if (mediaLinks.includes("/reel/")) {
        isReel = true;
      } else if (mediaLinks.includes("/p/")) {
        // support will be added later
        // isImage = true;
      }
    } else if (mediaLinks.includes("youtube.com")) {
      isYoutube = true;
      const res = await getYoutubeDownloadLink(mediaLinks);
      if (res.state) {
        downURL = res.downURL;
      } else {
        return res;
      }
      if (mediaLinks.includes("/watch?v")) {
        isVideo = true;
      } else if (mediaLinks.includes("/shorts/")) {
        isReel = true;
      }
    }

    if (
      !((isFb || isInstagram || isYoutube) && (isImage || isReel || isVideo))
    ) {
      return {
        state: false,
        message: "Please provide URL of Instagram Reels only.",
      };
    }

    return {
      isFb,
      isInstagram,
      isYoutube,
      isImage,
      isReel,
      downURL,
      isVideo,
      state: true,
      message: "Success",
    };
  } catch (error) {
    return { state: false, message: "Error occured, maybe media link is bad" };
  }
};

module.exports = { checkReqs };
