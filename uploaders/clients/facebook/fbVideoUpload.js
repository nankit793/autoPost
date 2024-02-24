const axios = require("axios")
const fbVideoUpload = async (fbPageID, pageAccessToken, file_url, tags, title, dbDoc) => {
    try {


        const baseURL = `https://graph.facebook.com/${fbPageID}/video_reels`
        const uploadStartUri = baseURL + `?upload_phase=start&access_token=${pageAccessToken}`;

        const initiateUploadResponse = await axios.post(uploadStartUri)

        if (initiateUploadResponse.status !== 200) {
            return { state: false }
        }
        const { video_id, upload_url } = initiateUploadResponse.data;

        const headers = {
            Authorization: `OAuth ${pageAccessToken}`,
            file_url
        }

        const uploadVideo = await axios.post(upload_url, null, { headers: headers })
        if (uploadVideo.status !== 200) {
            return { state: false }
        }
        tags.unshift(title)
        setTimeout(async () => {
            const publishBase = baseURL + `?access_token=${pageAccessToken}&video_id=${video_id}&upload_phase=finish&video_state=PUBLISHED&description=${tags.join("%20").replaceAll("#", "%23").replaceAll(" ", "%20")}&title=${title.replaceAll(" ", "%20")}`
            const publishVideo = await axios.post(publishBase, null, { headers: headers })
            if (publishVideo.status !== 200) {
                return { state: false }
            }
            else {
                // update mongo
                console.log("uploaded to fb")
                dbDoc.uploadedToFb = true
                await dbDoc.save()
                return { state: true };
            }
        }, 20000);

    } catch (error) {
        console.log(error.message)
        return { state: false }
    }
}

module.exports = { fbVideoUpload }