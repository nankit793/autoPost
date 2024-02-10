const axios = require("axios")
const userTokenModel = require("../models/userTokens")
const { returnFbAccessToken } = require("./returnFbUserToken")

const generateFbUserToken = async (appSecret, appID, pageName) => {
    try {
        const { token, state } = await returnFbAccessToken(pageName)
        console.log(token, state)
        if (!token && !state) {
            let doc = await userTokenModel({ pageName: pageName })
            return await doc.save()
        }
        const appURL = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appID}&client_secret=${appSecret}&fb_exchange_token=${token}`
        const response = await axios.post(appURL)
        console.log(response)
        if (response.status == 200 && response.data && response.data.access_token) {
            let doc = await userTokenModel.findOne({ pageName })
            if (!doc) {
                doc = new userTokenModel({ pageName })
            }
            doc.token = response.data.access_token
            await doc.save()
        }
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = { generateFbUserToken }