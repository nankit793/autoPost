const fs = require("fs");
const axios = require("axios");
const path = require("path");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

function deleteFolderContents(folderPath) {
  try {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const curPath = path.join(folderPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          // Recursive call for directories
          deleteFolderRecursive(curPath);
        } else {
          // Delete file
          fs.unlinkSync(curPath);
        }
      });
    }
  } catch (error) {
    return;
  }
}

async function downloadVideo(videoUrl, mediaFilePath) {
  try {
    const outputPath = path.join(mediaFilePath, "downloaded.mp4");
    await fs.mkdir(mediaFilePath, { recursive: true }, (err) => {
      if (err) {
        console.log("error");
        return { state: false };
      }
    });
    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream",
    });
    response.data.pipe(fs.createWriteStream(outputPath));
    return new Promise((resolve, reject) => {
      response.data.on("end", () => {
        resolve({ state: true });
      });
      response.data.on("error", (err) => {
        resolve({ state: false });
      });
    });
  } catch (error) {
    throw error(error.message);
  }
}

// Function to trim the video to 60 seconds if it's longer
async function trimVideoIfNeeded(mediaFilePath) {
  const inputFilePath = path.join(mediaFilePath, "downloaded.mp4");
  const outputFilePath = path.join(mediaFilePath, "trimmed.mp4");
  return await new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .setStartTime(0) // Start time in seconds
      .setDuration(55) // Duration in seconds
      .output(outputFilePath)
      .on("end", async () => {
        resolve({ state: true, path: outputFilePath });
      })
      .on("error", async (err) => {
        console.log("error", err.message);
        resolve({ state: true, path: inputFilePath });
      })
      .run();
  });
}

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}
// Function to upload the video to YouTube
async function uploadVideoToYouTube(
  videoFilePath,
  youtubeClient,
  dbDoc,
  title,
  tags
) {
  try {
    const fileExists = fileExists(videoFilePath);
    if (!fileExists) {
      console.log("file does not exist");
      return { state: false };
    }
    const youtube = youtubeClient;
    return await new Promise(async (resolve, reject) => {
      youtube.videos.insert(
        {
          part: "snippet,status",
          requestBody: {
            snippet: {
              title: title,
              description: tags.join(" "),
              tags: ["Shorts"], // Add the "Shorts" tag to indicate it's a Short
            },
            status: {
              privacyStatus: "public", // Set privacy status: public, private, or unlisted
              selfDeclaredMadeForKids: false,
            },
          },
          media: {
            body: fs.createReadStream(videoFilePath),
          },
        },

        async (err, res) => {
          if (err) {
            console.error("Upload failed:", err.message);
            reject({ state: false });
          }
          dbDoc.uploadedToYoutube = true;
          await dbDoc.save();
          resolve({ state: true });
        }
      );
    });
  } catch (error) {
    return { state: false };
  }
}

const uploadShorts = async (
  videoUrl,
  mediaFilePath,
  youtubeClient,
  model,
  title,
  tags
) => {
  try {
    await deleteFolderContents(mediaFilePath);
    const download = await downloadVideo(videoUrl, mediaFilePath);

    if (!download.state) {
      return { state: false };
    }

    // const trimmer = await trimVideoIfNeeded(
    //   mediaFilePath,
    //   youtubeClient,
    //   model,
    //   title,
    //   tags
    // );
    // if (!trimmer.state) {
    //   return { state: false };
    // }

    const downloadedFilePath = path.join(mediaFilePath, "downloaded.mp4");

    const upload = await uploadVideoToYouTube(
      downloadedFilePath,
      youtubeClient,
      model,
      title,
      tags
    );

    await deleteFolderContents(mediaFilePath);

    return upload;
  } catch (error) {
    return { state: false };
  }
};
module.exports = { uploadShorts };
