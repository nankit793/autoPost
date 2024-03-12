const axios = require("axios");
const publishReel = async (
  baseURL,
  pageAccessToken,
  video_id,
  tags,
  headers,
  dbDoc,
  uploadIteration
) => {
  const publishBase =
    baseURL +
    `?access_token=${pageAccessToken}&video_id=${video_id}&upload_phase=finish&video_state=PUBLISHED&description=${tags
      .join("%20")
      .replaceAll("#", "%23")
      .replaceAll(" ", "%20")}`;
  try {
    const publishVideo = await axios.post(publishBase, null, {
      headers: headers,
    });
    if (publishVideo.status !== 200) {
      return { state: false };
    } else {
      // update mongo
      dbDoc.uploadedToFb = true;
      await dbDoc.save();
      return { state: true };
    }
  } catch (error) {
    console.log("Try: ", uploadIteration, error.message, "posting in FB");
  }
};
const fbVideoUpload = async (
  fbPageID,
  pageAccessToken,
  file_url,
  tags,
  title,
  dbDoc
) => {
  try {
    const baseURL = `https://graph.facebook.com/${fbPageID}/video_reels`;
    const uploadStartUri =
      baseURL + `?upload_phase=start&access_token=${pageAccessToken}`;

    const initiateUploadResponse = await axios.post(uploadStartUri);
    if (initiateUploadResponse.status !== 200) {
      return { state: false };
    }
    const { video_id, upload_url } = initiateUploadResponse.data;

    const headers = {
      Authorization: `OAuth ${pageAccessToken}`,
      file_url,
    };

    const uploadVideo = await axios.post(upload_url, null, {
      headers: headers,
    });

    if (uploadVideo.status !== 200) {
      return { state: false };
    }
    tags.unshift(title);
    const initiatePublish = async (n) => {
      if (n > 10) {
        return { state: false };
      }
      const res = await publishReel(
        baseURL,
        pageAccessToken,
        video_id,
        tags,
        headers,
        dbDoc,
        n
      );
      if (res.state) {
        return { state: true };
      } else {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return await initiatePublish(n + 1);
      }
    };

    await new Promise((resolve) => setTimeout(resolve, 10000));
    return await initiatePublish(0);
  } catch (error) {
    console.log(error.message);
    return { state: false };
  }
};

module.exports = { fbVideoUpload };
