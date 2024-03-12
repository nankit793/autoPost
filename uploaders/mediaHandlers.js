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
    return await instaMediaUploader(
      instance.IgUserId,
      result,
      accessToken,
      url
    );
  }
  return { state: false };
};

const uploadToFB = async (notUploadedUrls, title, tags, instance) => {
  const result = notUploadedUrls.find((url) => {
    return !url.uploadedToFb;
  });

  if (result) {
    title = result?.postTitle || title;
    const fileIdOnDrive = result?.driveFileId;
    if (result?.isImage) {
      let url = `https://graph.facebook.com/v19.0/${instance.fbUserId}/photos?url=https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}&access_token=${instance.pageAccessToken}`;
      return await fbImageUplaod(result, url);
    } else if (result?.isReel) {
      let url = `https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}`;
      return await fbVideoUpload(
        instance.fbUserId,
        instance.pageAccessToken,
        url,
        tags,
        title,
        result
      );
    }
    return { state: false };
  }
};

const uploadToYoutube = async (notUploadedUrls, title, tags, instance) => {
  const result = notUploadedUrls.find((url) => {
    return !url.uploadedToYoutube;
  });
  if (result) {
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

    return await uploadShorts(
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
    console.log(
      "Initialized for",
      instance.name,
      "---------------------------"
    );
    const Start = new Date().getTime();
    const yt = await uploadToYoutube(notUploadedUrls, title, tags, instance);
    const fb = await uploadToFB(notUploadedUrls, title, tags, instance);
    const ig = await uploadToInsta(notUploadedUrls, title, tags, instance);
    const end = new Date().getTime();
    console.log("Youtube: ", yt?.state ? "Uploaded" : "Not Uploaded");
    console.log("Instaram: ", ig?.state ? "Uploaded" : "Not Uploaded");
    console.log("Facebook: ", fb?.state ? "Uploaded" : "Not Uploaded");
    console.log(
      "Execution Time for",
      instance.name,
      ":",
      (end - Start) / 1000,
      "'s"
    );
  } catch (error) {
    console.log(error.message);
    throw Error("Server Error, please contant developer");
    // return { message: "Server Error, please contant developer", state: false }
  }
};

const initiateUploader = async () => {
  try {
    for (let key in instances) {
      if (instances[key].active) {
        await uploader(instances[key]);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = { initiateUploader };
