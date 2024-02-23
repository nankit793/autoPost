const readline = require('readline');
const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/youtube.upload'];
const OAuthTokens = require('../../models/OAuthToken');

async function processAuthTokens(pageName, oAuth2Client) {
    try {
        let OAuthTokenDoc = await OAuthTokens.findOne({ pageName: pageName })
        if (!OAuthTokenDoc) {
            console.log("no doc")
            OAuthTokenDoc = await OAuthTokens({ pageName: pageName })
            await authorize(oAuth2Client, OAuthTokenDoc);
        }
        if (OAuthTokenDoc.expiry_date < Date.now()) {
            console.log("tokens expired")
            const refresh_token = OAuthTokenDoc.refresh_token;
            const { tokens } = await oAuth2Client.refreshToken(refresh_token);
            OAuthTokenDoc.refreshToken = refresh_token
            OAuthTokenDoc.access_token = tokens.access_token
            OAuthTokenDoc.expiry_date = tokens.expiry_date
            await OAuthTokenDoc.save()
            console.log("new tokens generated")
        }

        return OAuthTokenDoc;
    } catch (error) {
        console.error('Error refreshing tokens:', error);
        throw error;
    }
}

async function authorize(oAuth2Client, OAuthTokenDoc) {

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
        OAuthTokenDoc.refresh_token = tokens.refresh_token
        OAuthTokenDoc.access_token = tokens.access_token
        OAuthTokenDoc.expiry_date = tokens.expiry_date
        OAuthTokenDoc.token_type = tokens.token_type
        OAuthTokenDoc.scope = tokens.scope
        await OAuthTokenDoc.save()
    } catch (error) {
        console.error('Error retrieving access token:', error);
        throw error;
    }
}
module.exports = { processAuthTokens }