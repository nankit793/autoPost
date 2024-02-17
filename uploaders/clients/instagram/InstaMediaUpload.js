const axios = require('axios');
// const UrlModel = require('../../../../models/revivingSoluz/URLmodel');
const instaMediaUploader = async (IgID, dbDoc, accessToken, url) => {
    try {
        await axios.post(url).then(async (response) => {
            console.log('Response media: ', response.data);
            const responseID = response.data.id
            await publishMedia(IgID, responseID, accessToken, dbDoc)
        })
            .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
            });
    } catch (error) {
        console.error('Error downloading image:', error.message);
        throw error;
    }
}
const publishMedia = async (IgID, responseID, accessToken, dbDoc) => {

    let uploadIteration = 0
    const interval = setInterval(() => {
        uploadIteration = uploadIteration + 1
        if (uploadIteration <= 10) {
            const mediaPublish = async () => {
                await axios.post(`https://graph.facebook.com/v19.0/${IgID}/media_publish?creation_id=${responseID}&access_token=${accessToken}`)
                    .then(async (response) => {
                        if (response.status = 200 && response.data) {
                            clearInterval(interval)
                            console.log(response.data, "published at insta")
                            dbDoc.uploadedToInstagram = true
                            await dbDoc.save()
                            return { state: true };
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error.message);
                    });
            }
            mediaPublish()
        }
        else {
            clearInterval(interval)
            return false
        }
    }, 10000)

}

module.exports = { instaMediaUploader, publishMedia }