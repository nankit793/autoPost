const { google } = require('googleapis');
const { processAuthTokens } = require('../../controllers/tokens/processAuthTokens');

const credentials = require('./credentials.json');
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, "http://localhost:3000/") //for development
// const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, "https://autopost-61a4.onrender.com/") //for production
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