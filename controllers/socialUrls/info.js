const { google } = require("googleapis");

const processFiles = (files) => {
    uploadToFBCount = 0
    uploadToYoutubeCount = 0
    notUploadedToInstaUrls = []
    notUploadedToYoutubeUrls = []
    notUploadedToFbUrls = []
    numOfReels = 0
    numOfImages = 0
    uploadToInstaCount = 0
    notUploadedAnywhereUrls = []
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        if (element.uploadedToFb) {
            uploadToFBCount = uploadToFBCount + 1
        }
        else {
            notUploadedToFbUrls.push(element.url)
        }
        if (element.uploadedToInstagram) {
            uploadToInstaCount = uploadToInstaCount + 1
        }
        else {
            notUploadedToInstaUrls.push(element.url)
        }
        if (element.uploadedToYoutube) {
            uploadToYoutubeCount = uploadToYoutubeCount + 1
        }
        else {
            notUploadedToYoutubeUrls.push(element.url)
        }
        if (!element.uploadedToFb && !element.uploadedToInstagram && !element.uploadedToYoutube) {
            notUploadedAnywhereUrls.push(element.url)
        }
        if (element.isImage) {
            numOfImages = numOfImages + 1
        }
        else if (element.isReel) {
            numOfReels = numOfReels + 1
        }
    }

    return {
        uploadCounts: { uploadToFBCount, uploadToInstaCount, uploadToYoutubeCount },
        notUploadedAnywhereUrls,
        notUploadedUrls: {
            notUploadedToFbUrls, notUploadedToInstaUrls, notUploadedToYoutubeUrls
        },
        numOfImages, numOfReels
    }
}
const Info = async (URLmodel) => {
    try {
        const files = await URLmodel.find()
        const fileInformation = processFiles(files)
        return { state: true, message: '', totalURLS: files.length, ...fileInformation }
    } catch (error) {
        return { state: false, message: error.message || "please notify developer" }
    }
}

module.exports = { Info }