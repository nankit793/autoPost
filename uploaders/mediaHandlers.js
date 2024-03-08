const { fbImageUplaod } = require("./clients/facebook/fbImageUpload");
const { instaMediaUploader } = require("./clients/instagram/InstaMediaUpload");
const { uploadShorts } = require("./clients/youtube/uploadShorts");
const { fbVideoUpload } = require("./clients/facebook/fbVideoUpload");
const { google } = require("googleapis");
const path = require("path");
const { validateOauth } = require("../0Authtokens/validateOAuth");
const {
  returnFbAccessToken,
} = require("../controllers/tokens/returnFbUserToken");
const { randomTitle, randomTags } = require("../controllers/randomPostData");
const { instances } = require("../assets/socialData");

const uploadToInsta = async (notUploadedUrls, title, tags, instance) => {
  const { token } = await returnFbAccessToken(instance.name);
  let accessToken = token;
  if (!token) throw new Error("FB token may not be available, doc created");

  const baseURL = `https://graph.facebook.com/v19.0/${instance.IgUserId}/media`;
  const result = notUploadedUrls.find((url) => {
    return !url.uploadedToInstagram;
  });

  if (result) {
    console.log("initiated for instagram", instance.name);
    title = result?.postTitle || title;
    const fileIdOnDrive = result?.driveFileId;
    const downloadURL = `https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}`;
    let url = "";
    if (result?.isImage) {
      url = baseURL + `?image_url=${downloadURL}&access_token=${accessToken}`;
    } else if (result?.isReel) {
      tags.unshift(title);
      url =
        baseURL +
        `?video_url=${downloadURL}&access_token=${accessToken}&media_type=REELS&caption=${tags
          .join("%20")
          .replaceAll("#", "%23")
          .replaceAll(" ", "%20")}`;
    }
    await instaMediaUploader(instance.IgUserId, result, accessToken, url);
  }
  return;
};

const uploadToFB = async (notUploadedUrls, title, tags, instance) => {
  const result = notUploadedUrls.find((url) => {
    return !url.uploadedToFb;
  });

  if (result) {
    console.log("initiated for facebook", instance.name);
    title = result?.postTitle || title;
    const fileIdOnDrive = result?.driveFileId;
    if (result?.isImage) {
      let url = `https://graph.facebook.com/v19.0/${instance.fbUserId}/photos?url=https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}&access_token=${instance.pageAccessToken}`;
      await fbImageUplaod(result, url);
    } else if (result?.isReel) {
      let url = `https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}`;
      await fbVideoUpload(
        instance.fbUserId,
        instance.pageAccessToken,
        url,
        tags,
        title,
        result
      );
    }
  }
};

const uploadToYoutube = async (notUploadedUrls, title, tags, instance) => {
  const result = notUploadedUrls.find((url) => {
    return !url.uploadedToYoutube;
  });
  if (result) {
    console.log("initiated for youtube", instance.name);
    title = result?.postTitle || title;
    const fileIdOnDrive = result?.driveFileId;
    const videoUrl = `https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}`;
    const { oAuth2Client } = await validateOauth(instance.name);

    const youtubeClient = google.youtube({ version: "v3", auth: oAuth2Client });

    const currPath = path.join(__dirname);
    const mediaFilePath = path.join(
      currPath,
      `./clients/youtube/youtubeMedia/${instance.name}`
    );

    await uploadShorts(
      videoUrl,
      mediaFilePath,
      youtubeClient,
      result,
      title,
      tags
    );
  }
};

const uploader = async (instance) => {
  try {
    const notUploadedUrls = await instance.model.find({
      $or: [
        { uploadedToFb: false },
        { uploadedToInstagram: false },
        { uploadedToYoutube: false },
      ],
    });

    const title = randomTitle(instance.titles);
    const tags = randomTags(instance.tags);

    await uploadToYoutube(notUploadedUrls, title, tags, instance);
    await uploadToFB(notUploadedUrls, title, tags, instance);
    await uploadToInsta(notUploadedUrls, title, tags, instance);
  } catch (error) {
    console.log(error);
    throw Error("Server Error, please contant developer");
    // return { message: "Server Error, please contant developer", state: false }
  }
};

const initiateUploader = async () => {
  try {
    for (let key in instances) {
      if (instances[key].active) {
        uploader(instances[key]);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = { initiateUploader };
