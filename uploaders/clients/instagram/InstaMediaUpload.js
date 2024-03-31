const axios = require("axios");

const generateContainer = async (url) => {
  try {
    return await axios
      .post(url)
      .then(async (response) => {
        const responseID = response.data.id;
        return responseID;
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
      });
  } catch (error) {
    console.error("Error downloading image:", error.message);
    throw error;
  }
};

const instaMediaUploader = async (IgID, dbDoc, accessToken, url) => {
  try {
    const responseID = await generateContainer(url);
    return await publishMedia(IgID, responseID, accessToken, dbDoc);
  } catch (error) {
    console.error("Error downloading image:", error.message);
    throw error;
  }
};

const startPublish = async (
  IgID,
  responseID,
  accessToken,
  dbDoc,
  uploadIteration
) => {
  return await axios
    .post(
      `https://graph.facebook.com/v19.0/${IgID}/media_publish?creation_id=${responseID}&access_token=${accessToken}`
    )
    .then(async (response) => {
      if ((response.status = 200 && response.data)) {
        dbDoc.uploadedToInstagram = true;
        await dbDoc.save();
        return { state: true };
      }
    })
    .catch((error) => {
      console.error("Try: ", uploadIteration, error.message, "Posting in IG");
      return { state: false };
    });
};

const publishMedia = async (IgID, responseID, accessToken, dbDoc) => {
  const initiatePublish = async (n) => {
    if (n > 10) {
      return { state: false };
    }
    const res = await startPublish(IgID, responseID, accessToken, dbDoc, n);
    if (res?.state) {
      return { state: true };
    } else {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      return await initiatePublish(n + 1);
    }
  };
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await initiatePublish(0);
};

module.exports = { instaMediaUploader, publishMedia, generateContainer };
