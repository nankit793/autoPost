const axios = require("axios");
const stream = require("stream");

async function uploadtVideoToDrive(url, drive) {
  try {
    const videoBuffer = await downloadMedia(url);
    const driveFileId = await uploadToDrive(videoBuffer.data, drive);
    return { state: true, driveFileId };
  } catch (error) {
    return { state: false, message: "Contact developer" };
  }
}

async function uploadToDrive(videoBuffer, drive) {
  try {
    const media = {
      mimeType: "video/mp4",
      body: new stream.Readable({
        read() {
          this.push(videoBuffer);
          this.push(null);
        },
      }),
    };

    const response = await drive.files.create({
      requestBody: {
        name: "converted_video.mp4",
        mimeType: "video/mp4",
      },
      media,
    });

    const fileId = response.data.id;
    // Set the visibility of the file to private
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    return fileId;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    throw error;
  }
}

async function downloadMedia(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"];
    return { contentType, data: Buffer.from(response.data, "binary") };
  } catch (error) {
    console.error("Error downloading video:", error);
    throw error;
  }
}

module.exports = { uploadtVideoToDrive, downloadMedia };
