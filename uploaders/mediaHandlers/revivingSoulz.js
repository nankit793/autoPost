
const UrlModelRevSoulz = require("../../models/revivingSoluz/URLmodel");
const { fbImageUplaod } = require("../clients/facebook/fbImageUpload");
const { instaMediaUploader } = require("../clients/instagram/InstaMediaUpload");
const { uploadShorts } = require("../clients/youtube/uploadShorts");
const { validateOauthRevivingSoulz } = require("../../0Authtokens/revivingSoulz/refreshSoulz");
const { google } = require("googleapis");
const { fbVideoUpload } = require("../clients/facebook/fbVideoUpload");
const { returnFbAccessToken } = require("../../controllers/tokens/returnFbUserToken");
const path = require("path")

const revivingSoluzInsta = async (notUploadedUrls) => {
    const { token } = await returnFbAccessToken("revivingSoulz")
    let accessToken = token;
    if (!token) {
        return result.status(401).json({ state: false, message: "fb user token not valid, or not given" })
    }
    const baseURL = "https://graph.facebook.com/v19.0/17841464678870993/media"
    const result = notUploadedUrls.find((url) => {
        return !url.uploadedToInstagram
    });

    if (result) {
        const fileIdOnDrive = result?.driveFileId;
        const downloadURL = `https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}`
        let url = "";
        if (result?.isImage) {
            url = baseURL + `?image_url=${downloadURL}&access_token=${accessToken}`
        }
        else if (result?.isReel) {
            url = baseURL + `?video_url=${downloadURL}&access_token=${accessToken}&media_type=REELS`
        }
        await instaMediaUploader("17841464678870993", result, accessToken, url)
    }
    return
}
const revivingSoluzFB = async (notUploadedUrls) => {

    const result = notUploadedUrls.find((url) => {
        return !url.uploadedToFb
    });

    if (result) {
        const fileIdOnDrive = result?.driveFileId;
        let pageAccessToken = "EAAJ2lhUzpvMBOxUp0sM9ojxxX5JOU7OXulSH3LdXkLVuNYLro973EPZBqVzZCy6MhbbX3OLFOXERY0GpdiV7gRIUvsuJ3sm0w7OK1QKDdoTaLD82yMTmP7NHgCAC1LxCd3Pk0flHE0JYA2eKYW6DjzIb6PT9wmZB5NNGUkvZAxxJJwxbJT1pWzngIXoYqq2SKPTufs7f4nnqAuAZD"

        if (result?.isImage) {
            let url = `https://graph.facebook.com/v19.0/201428166395003/photos?url=https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}&access_token=${pageAccessToken}`
            await fbImageUplaod(result, url)
        }

        else if (result?.isReel) {
            let url = `https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}`
            await fbVideoUpload('201428166395003', pageAccessToken, url, "", "", result)
        }
    }
}
const revivingSoulzYT = async (notUploadedUrls) => {

    const result = notUploadedUrls.find((url) => {
        return !url.uploadedToYoutube
    });
    if (result) {
        const fileIdOnDrive = result?.driveFileId;
        const videoUrl = `https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}`
        const { oAuth2Client } = await validateOauthRevivingSoulz()
        const youtubeClient = google.youtube({ version: 'v3', auth: oAuth2Client });

        const currPath = path.join(__dirname);
        const mediaFilePath = path.join(currPath, "../clients/youtube/youtubeMedia/revivingSoulz");
        console.log(mediaFilePath)
        await uploadShorts(videoUrl, mediaFilePath, youtubeClient, result)
    }

}
const uploadToRevivingSoulz = async () => {
    try {
        const notUploadedUrls = await UrlModelRevSoulz.find({
            $or: [
                { uploadedToFb: false },
                { uploadedToInstagram: false },
                { uploadedToYoutube: false }
            ]
        });

        await revivingSoulzYT(notUploadedUrls)
        await revivingSoluzFB(notUploadedUrls)
        await revivingSoluzInsta(notUploadedUrls)

    } catch (error) {
        console.log(error)
    }
}

module.exports = { uploadToRevivingSoulz }
