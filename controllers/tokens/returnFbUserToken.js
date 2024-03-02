const axios = require("axios")
const userTokenModel = require("../../models/userTokens")

const returnFbAccessToken = async (pageName) => {
    let doc = await userTokenModel.findOne({ pageName })
    if (!doc || !doc?.token) {
        doc = userTokenModel({ pageName, token: "" })
        await doc.save()
        return { state: false, token: null }
    }
    return { state: true, token: doc.token || null }
}

module.exports = { returnFbAccessToken }