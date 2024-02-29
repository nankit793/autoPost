
const { fbImageUplaod } = require("./clients/facebook/fbImageUpload");
const { instaMediaUploader } = require("./clients/instagram/InstaMediaUpload");
const { uploadShorts } = require("./clients/youtube/uploadShorts");
const { fbVideoUpload } = require("./clients/facebook/fbVideoUpload");
const { google } = require("googleapis");
const path = require("path");
const { validateOauth } = require("../0Authtokens/validateOAuth");
const fs = require('fs');
// reviving soulz
const UrlModelRevSoulz = require("../models/revivingSoluz/URLmodel");
const { returnFbAccessToken } = require("../controllers/tokens/returnFbUserToken");
const { revivingSoulzTiles } = require("../assets/titles");
const { randomTitle, randomTags } = require("../controllers/randomPostData");
let revivingSoulzPageAccessToken = "EAAJ2lhUzpvMBOxUp0sM9ojxxX5JOU7OXulSH3LdXkLVuNYLro973EPZBqVzZCy6MhbbX3OLFOXERY0GpdiV7gRIUvsuJ3sm0w7OK1QKDdoTaLD82yMTmP7NHgCAC1LxCd3Pk0flHE0JYA2eKYW6DjzIb6PT9wmZB5NNGUkvZAxxJJwxbJT1pWzngIXoYqq2SKPTufs7f4nnqAuAZD"
let revivingSoulzFbUserId = "201428166395003"
let revivingSoulzIgUserId = "17841464678870993"

class SocialData {
    constructor(IgUserId, fbUserId, pageAccessToken, name, model, fbAccessToken, titles, tags) {
        this.pageAccessToken = pageAccessToken
        this.fbUserId = fbUserId
        this.IgUserId = IgUserId
        this.name = name
        this.model = model;
        this.fbAccessToken = fbAccessToken;
        this.titles = titles;
        this.tags = tags;
    }
}

const uploadToInsta = async (notUploadedUrls, title, tags, instance) => {
    const { token } = await returnFbAccessToken(instance.name)
    let accessToken = token;
    if (!token) {
        return result.status(401).json({ state: false, message: "fb user token not valid, or not given" })
    }
    const baseURL = `https://graph.facebook.com/v19.0/${instance.IgUserId}/media`
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
            tags.unshift(title)
            url = baseURL + `?video_url=${downloadURL}&access_token=${accessToken}&media_type=REELS&caption=${tags.join("%20").replaceAll("#", "%23").replaceAll(" ", "%20")}`
        }
        await instaMediaUploader(instance.IgUserId, result, accessToken, url)
    }
    return
}

const uploadToFB = async (notUploadedUrls, title, tags, instance) => {

    const result = notUploadedUrls.find((url) => {
        return !url.uploadedToFb
    });

    if (result) {
        const fileIdOnDrive = result?.driveFileId;
        if (result?.isImage) {
            let url = `https://graph.facebook.com/v19.0/${instance.fbUserId}/photos?url=https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}&access_token=${instance.pageAccessToken}`
            await fbImageUplaod(result, url)
        }
        else if (result?.isReel) {
            let url = `https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}`
            await fbVideoUpload(instance.fbUserId, instance.pageAccessToken, url, tags, title, result)
        }
    }
}

const uploadToYoutube = async (notUploadedUrls, title, tags, instance) => {

    const result = notUploadedUrls.find((url) => {
        return !url.uploadedToYoutube
    });
    if (result) {
        const fileIdOnDrive = result?.driveFileId;
        const videoUrl = `https://drive.usercontent.google.com/u/2/uc?id=${fileIdOnDrive}`
        const { oAuth2Client } = await validateOauth(instance.name)

        const youtubeClient = google.youtube({ version: 'v3', auth: oAuth2Client });

        const currPath = path.join(__dirname);
        const mediaFilePath = path.join(currPath, `./clients/youtube/youtubeMedia/${instance.name}`);

        await uploadShorts(videoUrl, mediaFilePath, youtubeClient, result, title, tags)
    }

}

const uploader = async (instance) => {
    try {
        const notUploadedUrls = await instance.model.find({
            $or: [
                { uploadedToFb: false },
                { uploadedToInstagram: false },
                { uploadedToYoutube: false }
            ]
        });

        const title = randomTitle(instance.titles)
        const tags = randomTags()

        await uploadToYoutube(notUploadedUrls, title, tags, instance)
        await uploadToFB(notUploadedUrls, title, tags, instance)
        await uploadToInsta(notUploadedUrls, title, tags, instance)

    } catch (error) {
        console.log(error)
    }
}

const initiateUploader = async () => {
    const revivingSoulz = new SocialData(revivingSoulzIgUserId, revivingSoulzFbUserId, revivingSoulzPageAccessToken, "revivingSoulz", UrlModelRevSoulz, returnFbAccessToken, revivingSoulzTiles, [])
    await uploader(revivingSoulz)
}
module.exports = { initiateUploader }
