const { uploadImageToDrive } = require("../uploaders/clients/drive/driveImageUploader");
const { uploadtVideoToDrive } = require("../uploaders/clients/drive/driveVideoUploader");

const processUrlRequest = async (params) => {
    try {
        const { mediaLinks, isFb, isInstagram, isYoutube, isImage, isReel, uploadedToYoutube, downURL, URLmodel, drive } = params

        let driveFileId;
        if (isImage) {
            uploadedToYoutube = true;
            driveFileId = await uploadImageToDrive(downURL, drive);
        }
        else if (isReel) {
            driveFileId = await uploadtVideoToDrive(downURL, drive);
        }
        console.log(driveFileId)
        const newUrl = new URLmodel({
            url: mediaLinks,
            isFb,
            isInstagram,
            isYoutube,
            isImage,
            isReel,
            driveFileId,
            uploadedToYoutube
        });

        await newUrl.save();

        return { state: true, newUrl }

    } catch (error) {
        return { state: false, message: error.message || "Server issue, please contact developer" }
    }
}
module.exports = { processUrlRequest }