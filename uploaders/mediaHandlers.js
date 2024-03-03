
const { fbImageUplaod } = require("./clients/facebook/fbImageUpload");
const { instaMediaUploader } = require("./clients/instagram/InstaMediaUpload");
const { uploadShorts } = require("./clients/youtube/uploadShorts");
const { fbVideoUpload } = require("./clients/facebook/fbVideoUpload");
const { google } = require("googleapis");
const path = require("path");
const { validateOauth } = require("../0Authtokens/validateOAuth");
const fs = require('fs');
const { returnFbAccessToken } = require("../controllers/tokens/returnFbUserToken");
const { randomTitle, randomTags } = require("../controllers/randomPostData");
const { revivingSoulzTiles, animetoTitles } = require("../assets/titles");

// reviving soulz
const UrlModelRevSoulz = require("../models/revivingSoluz/URLmodel");
let revivingSoulzPageAccessToken = "EAAJ2lhUzpvMBOxUp0sM9ojxxX5JOU7OXulSH3LdXkLVuNYLro973EPZBqVzZCy6MhbbX3OLFOXERY0GpdiV7gRIUvsuJ3sm0w7OK1QKDdoTaLD82yMTmP7NHgCAC1LxCd3Pk0flHE0JYA2eKYW6DjzIb6PT9wmZB5NNGUkvZAxxJJwxbJT1pWzngIXoYqq2SKPTufs7f4nnqAuAZD"
let revivingSoulzFbUserId = "201428166395003"
let revivingSoulzIgUserId = "17841464678870993"

// animeto
const { animetoTags } = require("../assets/tags");
const AnimetoModel = require("../models/animeto/URLmodel");
let animetoPageAccessToken = "EAAK69zoePbMBOya2sDlkZAriTIFaccZBiDzoU7e1tjE7LEVX5PEZCiFZCVLkfUuHJvQT2fvH78G0cwkJvA27eo4iH6oYHbV2fhrbg4JlKd7vqZB8NdFZCwdZAm1N3BVZC2XwViMyYgIQsLE7kzoJY0VbvZCFYvJOZAGUUsrectVpXro7BedYKUUG6UiNF8xuFrnfSB8QZA2tc4RFY7ZB6Q7L5T0gJDeu6M6zbQlqQ2cvougZD"
let animetoFbUserId = "278856668633727"
let animeIgUserId = "17841465133015574"


class SocialData {
    constructor(IgUserId, fbUserId, pageAccessToken, name, model, titles, tags) {
        this.pageAccessToken = pageAccessToken
        this.fbUserId = fbUserId
        this.IgUserId = IgUserId
        this.name = name
        this.model = model;
        this.titles = titles;
        this.tags = tags;
    }
}

const uploadToInsta = async (notUploadedUrls, title, tags, instance) => {
    const { token } = await returnFbAccessToken(instance.name)
    let accessToken = token;
    if (!token)
        throw new Error("FB token may not be available, doc created")

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
        console.log("initiated for", instance.name)
        const notUploadedUrls = await instance.model.find({
            $or: [
                { uploadedToFb: false },
                { uploadedToInstagram: false },
                { uploadedToYoutube: false }
            ]
        });

        const title = randomTitle(instance.titles)
        const tags = randomTags(instance.tags)

        await uploadToYoutube(notUploadedUrls, title, tags, instance)
        await uploadToFB(notUploadedUrls, title, tags, instance)
        await uploadToInsta(notUploadedUrls, title, tags, instance)

    } catch (error) {
        console.log(error)
        throw new Error("Server Error, please contant developer")
        // return { message: "Server Error, please contant developer", state: false }
    }
}

const initiateUploader = async () => {
    try {

        const revivingSoulz = new SocialData(revivingSoulzIgUserId, revivingSoulzFbUserId, revivingSoulzPageAccessToken, "revivingSoulz", UrlModelRevSoulz, revivingSoulzTiles, animetoTags)
        const animeto = new SocialData(animeIgUserId, animetoFbUserId, animetoPageAccessToken, "animeto", AnimetoModel, animetoTitles, animetoTags)
        await uploader(revivingSoulz)
        await uploader(animeto)
    } catch (error) {
        console.log(error)
    }
}
module.exports = { initiateUploader }
