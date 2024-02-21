const fs = require('fs');
const axios = require('axios');
const path = require("path")
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

function deleteFolderContents(folderPath) {

    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {

            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // Recursive call for directories
                deleteFolderRecursive(curPath);
            } else { // Delete file
                fs.unlinkSync(curPath);
            }
        });
        console.log(`Contents of folder '${folderPath}' deleted successfully.`);
    }
}

async function downloadVideo(videoUrl, mediaFilePath) {
    try {

        const outputPath = path.join(mediaFilePath, "downloaded.mp4");

        const response = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream',
        });
        await fs.mkdir(mediaFilePath, { recursive: true }, (err) => {
            if (err) {
            } else {
                console.log("folder created")
            }
        });
        response.data.pipe(fs.createWriteStream(outputPath));
        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
                resolve();
            });
            response.data.on('error', (err) => {
                reject(err);
            });
        });
    } catch (error) {
        throw error(error.message)
    }
}

// Function to trim the video to 60 seconds if it's longer
function trimVideoIfNeeded(mediaFilePath, youtubeClient, dbDoc, title, tags) {
    const inputFilePath = path.join(mediaFilePath, "downloaded.mp4");
    const outputFilePath = path.join(mediaFilePath, "trimmed.mp4");

    ffmpeg(inputFilePath)
        .setStartTime(0) // Start time in seconds
        .setDuration(59) // Duration in seconds
        .output(outputFilePath)
        .on('end', () => {
            console.log('Trimmed video saved:', outputFilePath);
            uploadVideoToYouTube(outputFilePath, youtubeClient, mediaFilePath, dbDoc, title, tags)
        })
        .on('error', (err) => {
            console.error('Error trimming video:', err);
            uploadVideoToYouTube(inputFilePath, youtubeClient, mediaFilePath, dbDoc, title, tags)
        })
        .run();
}

// Function to upload the video to YouTube
async function uploadVideoToYouTube(videoFilePath, youtubeClient, mediaFilePath, dbDoc, title, tags) {
    const fileSize = fs.statSync(videoFilePath).size;
    const youtube = youtubeClient;
    youtube.videos.insert(
        {
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: title,
                    description: tags,
                    tags: ['Shorts'], // Add the "Shorts" tag to indicate it's a Short
                },
                status: {
                    privacyStatus: 'public', // Set privacy status: public, private, or unlisted
                },
            },
            media: {
                body: fs.createReadStream(videoFilePath),
            },
        },
        {
            onUploadProgress: (event) => {
                const progress = Math.round((event.bytesRead / fileSize) * 100);
                if (progress % 10 === 0) {
                    console.log(`${progress}% completed`);
                }
            },
        },
        async (err, res) => {

            await deleteFolderContents(mediaFilePath)
            if (err) {
                console.error('Upload failed:', err.message);
                return;
            }
            dbDoc.uploadedToYoutube = true;

            await dbDoc.save()
            console.log('Youtube Video uploaded:');

        }
    );
}

const uploadShorts = async (videoUrl, mediaFilePath, youtubeClient, model, title, tags) => {

    downloadVideo(videoUrl, mediaFilePath)
        .then(() => {
            trimVideoIfNeeded(mediaFilePath, youtubeClient, model, title, tags);
        })
        .catch((error) => {
            console.error('Error downloading video:', error);
        });
}
module.exports = { uploadShorts }
