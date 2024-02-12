const fs = require('fs');
const path = require('path');
const TOKEN_DIR = path.join(__dirname);
const TOKEN_PATH = path.join(TOKEN_DIR, 'token.json');
const { google } = require('googleapis');
const readline = require('readline');
const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/youtube.upload'];
const credentials = require('./credentials.json');


const { client_secret, client_id, redirect_uris } = credentials.web;

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, "https://autopost-61a4.onrender.com/") //for production
// const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, "http://localhost:3000/") //for development
async function checkAndRefreshTokens() {
    try {
        if (!fs.existsSync(TOKEN_PATH)) {
            await authorize(oAuth2Client);
        }
        let tokenBuffer = fs.readFileSync(TOKEN_PATH);
        let oldTokens = JSON.parse(tokenBuffer.toString('utf-8'));

        if (oldTokens.expiry_date < Date.now()) {
            console.log("tokens expirer")
            const refresh_token = oldTokens.refresh_token;
            const { tokens } = await oAuth2Client.refreshToken(refresh_token);
            tokens.refresh_token = refresh_token;
            oldTokens = tokens
            console.log("refreshed")
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(oldTokens));
            console.log("refreshed again")
        }

        oAuth2Client.setCredentials(oldTokens);
        return { tokens: oldTokens, oAuth2Client };
    } catch (error) {
        console.error('Error refreshing tokens:', error);
        throw error;
    }
}

async function authorize(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const code = await new Promise((resolve) => {
        rl.question('Enter the code from that page here: ', (userInput) => {
            resolve(userInput);
            rl.close();
        });
    });

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

    } catch (error) {
        console.error('Error retrieving access token:', error);
        throw error;
    }
}
module.exports = { checkAndRefreshTokens }