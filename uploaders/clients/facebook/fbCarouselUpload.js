const axios = require("axios");
const { validateOauth } = require("../../../0Authtokens/validateOAuth");
const { google } = require("googleapis");

const fbCarouselUpload = async (
  fbPageID,
  pageAccessToken,
  url,
  tags,
  title,
  dbDoc,
  instance
) => {
  try {
    const { oAuth2Client } = await validateOauth(instance.name);
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    const fileIdOnDrive = dbDoc?.driveFileId;
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
    let newURL = url + "/photos";
    const uploadedImages = [];
    for (let index = 0; index < mediaIds.length; index++) {
      const element = mediaIds[index];
      const downloadURL = `https://drive.usercontent.google.com/u/2/uc?id=${element}`;
      let uploadURL =
        newURL +
        `?url=${downloadURL}&access_token=${pageAccessToken}&published=false`;

      await axios.post(uploadURL).then(async (response) => {
        uploadedImages.push(response.data.id);
      });
    }
    let mediaString = "";
    uploadedImages.map(
      (image, index) =>
        (mediaString =
          mediaString + `&attached_media[${index}]={"media_fbid": '${image}'}`)
    );
    const publishURL =
      url +
      `/feed?message=${title}&access_token=${pageAccessToken}` +
      mediaString;

    return await axios
      .post(publishURL)
      .then(async (response) => {
        dbDoc.uploadedToFb = true;
        await dbDoc.save();
        return { state: true };
      })
      .catch((err) => {
        console.log(err?.message);
        return { state: false };
      });
  } catch (error) {
    console.error("Error downloading image:", error.message);
    throw error;
  }
};

module.exports = { fbCarouselUpload };
