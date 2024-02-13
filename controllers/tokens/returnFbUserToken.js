const axios = require("axios")
const userTokenModel = require("../../models/userTokens")

const returnFbAccessToken = async (pageName) => {
    const doc = await userTokenModel.findOne({ pageName })
    if (!doc) {
        return { state: false, token: null }
    }
    return { state: true, token: doc.token || null }
}

module.exports = { returnFbAccessToken }