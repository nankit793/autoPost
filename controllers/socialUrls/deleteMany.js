const { google } = require("googleapis");
const { validateOauth } = require("../../0Authtokens/validateOAuth");
const { deleteDocsFromDrive } = require("../deleteDocsFromDrive");

const deleteMany = async (name, URLmodel) => {
    try {
        const documentsToDelete = await URLmodel.find({
            uploadedToFb: true,
            uploadedToInstagram: true,
            uploadedToYoutube: true,
        })

        const results = await URLmodel.deleteMany({
            uploadedToFb: true,
            uploadedToInstagram: true,
            uploadedToYoutube: true,
        });

        const { oAuth2Client } = await validateOauth(name)
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });
        await deleteDocsFromDrive(documentsToDelete, drive)
        return { state: true, message: `${results.deletedCount || ""} URLs removed` }

    } catch (error) {
        return { state: false, message: error.message || "Server error, contact developer" }
    }
}

module.exports = { deleteMany }