const { google } = require("googleapis");
const { validateOauth } = require("../../0Authtokens/validateOAuth");
const { deleteDocsFromDrive } = require("../deleteDocsFromDrive");

const deleteURL = async (url, URLmodel, name) => {
  try {
    const element = await URLmodel.findOne({ url });
    if (!element) {
      return { state: false, message: "This URL is not present" };
    }

    let shouldDelete = false;
    if (element?.isImage || element?.isCarousel) {
      if (!element.uploadedToFb && !element.uploadedToInstagram)
        shouldDelete = true;
    } else if (
      !element.uploadedToFb &&
      !element.uploadedToInstagram &&
      !element.uploadedToYoutube
    )
      shouldDelete = true;

    if (shouldDelete) {
      doc = await URLmodel.findOneAndDelete({ url });
      const { oAuth2Client } = await validateOauth(name);
      const drive = google.drive({ version: "v3", auth: oAuth2Client });
      await deleteDocsFromDrive([doc], drive);
      return { state: true, message: "URL removed successfully" };
    } else {
      return {
        state: false,
        message:
          "seems like url is uploaded in at least one social media, contact developer",
      };
    }
  } catch (error) {
    return {
      state: false,
      message: error.message || "Server error, Please contact developer",
    };
  }
};

module.exports = { deleteURL };
