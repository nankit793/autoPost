const { google } = require("googleapis");
const stream = require("stream");
const { uploadImageToDrive } = require("./driveImageUploader");

async function createFolder(drive) {
  const fileMetadata = {
    name: "carosal",
    mimeType: "application/vnd.google-apps.folder",
    parents: [], // If parentFolderId is provided, set it as the parent
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      fields: "id",
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
    console.error("Error creating folder:", error);
    return null;
  }
}

async function driveCarouselUploader(posts, drive) {
  try {
    if (posts?.length === 0) {
      return { state: false, message: "Post not found" };
    }
    const folderId = await createFolder(drive);

    if (folderId) {
      let i = 0;
      for (const post of posts) {
        // Create folder for the carousel post
        const imageUrl = post.download_link;
        const filename = `${i + 1}.jpeg`;
        i = i + 1;
        // Save image to Google Drive inside the created folder

        const uploadImage = await uploadImageToDrive(
          imageUrl,
          drive,
          folderId,
          filename
        );

        if (!uploadImage.state) {
          return {
            state: false,
            carousalError: true,
            driveFileId: folderId,
            message:
              uploadImage?.message || "Contact developer - flag is carousal",
          };
        }
      }
      return { state: true, driveFileId: folderId };
    } else {
      return {
        state: false,
        message: "Error in Google Drive, Contact developer",
      };
    }
  } catch (error) {
    console.error("Error downloading and saving carousel images:", error);
  }
}

module.exports = { driveCarouselUploader };
