const axios = require('axios');

const fbImageUplaod = async (dbDoc, url) => {
    try {
        await axios.post(url).then(async (response) => {
            console.log('Response media: ', response.data);
            mongoID = result.id

            dbDoc.uploadedToFb = true
            await dbDoc.save()
            console.log("uploaded to fb")
            return { state: true };
        })
            .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
            });
    } catch (error) {
        console.error('Error downloading image:', error.message);
        throw error;
    }
}


module.exports = { fbImageUplaod }