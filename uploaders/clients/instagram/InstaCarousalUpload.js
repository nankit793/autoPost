const axios = require("axios");
const { generateContainer, publishMedia } = require("./InstaMediaUpload");
const { validateOauth } = require("../../../0Authtokens/validateOAuth");
const { google } = require("googleapis");

const generateCarouselContainer = async (
  IgID,
  dbDoc,
  accessToken,
  containerIds,
  url,
  caption
) => {
  try {
    const newURl =
      url +
      `&media_type=CAROUSEL` +
      `&children=${containerIds.join("%2C")}` +
      `&caption=${caption}`;

    return await axios
      .post(newURl)
      .then(async (response) => {
        const responseID = response.data.id;
        return await publishMedia(IgID, responseID, accessToken, dbDoc);
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
const instaCarouselUploader = async (
  IgID,
  dbDoc,
  accessToken,
  fileIdOnDrive,
  instance,
  url,
  caption
) => {
  try {
    const { oAuth2Client } = await validateOauth(instance.name);
    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const response = await drive.files.list({
      q: `'${fileIdOnDrive}' in parents`,
      fields: "files(id, name)",
    });
    const mediaFiles = response.data.files.filter((file) =>
      /^\d+\..+$/.test(file.name)
    );

    // Sort files based on their names
    mediaFiles.sort((a, b) => {
      const regex = /^(\d+)\..+$/;
      const [, aIndex] = a.name.match(regex);
      const [, bIndex] = b.name.match(regex);
      return parseInt(aIndex) - parseInt(bIndex);
    });
    const mediaIds = mediaFiles.map((file) => {
      return file.id;
    });

    containerIds = [];

    for (let index = 0; index < mediaIds.length; index++) {
      const element = mediaIds[index];
      const downloadURL = `https://drive.usercontent.google.com/u/2/uc?id=${element}`;
      const newURL = url + `&image_url=${downloadURL}`;

      const responseID = await generateContainer(newURL);
      containerIds.push(responseID);
    }
    return await generateCarouselContainer(
      IgID,
      dbDoc,
      accessToken,
      containerIds,
      url,
      caption
    );
  } catch (error) {
    console.error("Error downloading image:", error.message);
    throw error;
  }
};

module.exports = { instaCarouselUploader };
