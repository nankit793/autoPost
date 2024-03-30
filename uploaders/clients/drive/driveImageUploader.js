const { google } = require("googleapis");
// const sharp = require('sharp');
const stream = require("stream");
const { downloadMedia } = require("./driveVideoUploader");

// Define the task to run every 30 seconds
const uploadImageToDrive = async (url, drive, folderID = "", fileName = "") => {
  try {
    const imageBuffer = await downloadMedia(url);
    if (imageBuffer?.contentType?.includes("image")) {
      const driveFileId = await uploadToDrive(
        imageBuffer.data,
        drive,
        folderID,
        fileName
      );
      return { state: true, driveFileId };
    }
    return {
      state: false,
      message: "Only images are accepted in Carousal",
    };
  } catch (error) {
    return { state: false, message: "contact developer" };
  }
};

async function uploadToDrive(imageBuffer, drive, folderID, fileName) {
  try {
    let fileMetadata = {};
    if (fileName && folderID) {
      fileMetadata = {
        parents: [folderID],
      };
    }

    const media = {
      mimeType: "image/jpeg",
      body: new stream.Readable({
        read() {
          this.push(imageBuffer);
          this.push(null);
        },
      }),
    };
    const response = await drive.files.create({
      requestBody: {
        name: fileName || "converted_image.jpg",
        mimeType: "image/jpeg",
        parents: folderID ? [folderID] : [],
      },
      resource: fileMetadata,
      media,
    });
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    return response.data.id;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    throw error;
  }
}

module.exports = { uploadImageToDrive };
