const { google } = require('googleapis');
const { processAuthTokens } = require('../controllers/tokens/processAuthTokens');


async function validateOauth(name) {
    const credentials = require(`./${name}/credentials.json`);
    const { client_secret, client_id } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, "https://is9mybzuyp.ap-south-1.awsapprunner.com/")
    try {
        const OAuthTokenDoc = await processAuthTokens(name, oAuth2Client)
        oAuth2Client.setCredentials(OAuthTokenDoc);
        return { tokens: OAuthTokenDoc, oAuth2Client };
    } catch (error) {
        console.error('Error refreshing tokens:', error);
        throw error;
    }
}

module.exports = { validateOauth }