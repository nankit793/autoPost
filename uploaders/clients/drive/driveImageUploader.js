const { google } = require('googleapis');
const sharp = require('sharp');
const stream = require('stream');
const { downloadMedia } = require('./driveVideoUploader');

// Define the task to run every 30 seconds
const uploadImageToDrive = async (url, drive) => {

  try {
    const imageBuffer = await downloadMedia(url);
    const jpegBuffer = await convertToJpeg(imageBuffer);
    const fileIdOnDrive = await uploadToDrive(jpegBuffer, drive);

    return fileIdOnDrive

  } catch (error) {
    console.error('An error occurred during the task:', error.message);
    return;
  }
};

async function convertToJpeg(imageBuffer) {
  try {

    return await sharp(imageBuffer).jpeg().toBuffer();
  } catch (error) {
    console.error('Error converting image to JPEG:', error);
    throw error;
  }
}

async function uploadToDrive(imageBuffer, drive) {
  try {
    const media = {
      mimeType: 'image/jpeg',
      body: new stream.Readable({
        read() {
          this.push(imageBuffer);
          this.push(null);
        },
      }),
    };
    const response = await drive.files.create({
      requestBody: {
        name: 'converted_image.jpg',
        mimeType: 'image/jpeg',
      },
      media
    });
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    return response.data.id;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}


module.exports = { uploadImageToDrive }
