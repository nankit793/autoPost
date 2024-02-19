const { google } = require('googleapis');
const { processAuthTokens } = require('../../controllers/tokens/processAuthTokens');

const credentials = require('./credentials.json');
const { client_secret, client_id } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, "https://is9mybzuyp.ap-south-1.awsapprunner.com/")

async function validateOauthRevivingSoulz() {
    try {
        const OAuthTokenDoc = await processAuthTokens("revivingSoulz", oAuth2Client)
        oAuth2Client.setCredentials(OAuthTokenDoc);
        return { tokens: OAuthTokenDoc, oAuth2Client };
    } catch (error) {
        console.error('Error refreshing tokens:', error);
        throw error;
    }
}

module.exports = { validateOauthRevivingSoulz }