const { google } = require("googleapis");
const { checkReqs } = require("../urlValidator");
const { processUrlRequest } = require("../procssUrlRequest");
const { validateOauth } = require("../../0Authtokens/validateOAuth");

const addURL = async (mediaLinks, name, URLmodel, title) => {
  let {
    state,
    message,
    isFb,
    isInstagram,
    isYoutube,
    isImage,
    isReel,
    uploadedToYoutube,
    downURL,
    isCarousel,
  } = await checkReqs(mediaLinks);
  if (!state) {
    return { state: false, message: message || "Please contact developer" };
    // return res.status(400).json({ message: message || "Please contact developer" })
  }

  try {
    const { oAuth2Client } = await validateOauth(name);
    const drive = google.drive({ version: "v3", auth: oAuth2Client });
    const params = {
      mediaLinks,
      isFb,
      isInstagram,
      isYoutube,
      isImage,
      isReel,
      uploadedToYoutube,
      downURL,
      URLmodel,
      drive,
      title,
      isCarousel,
    };
    const processReq = await processUrlRequest(params);

    if (processReq && processReq.state && processReq.newUrl) {
      return {
        state: true,
        message: "URL added successfully",
        doc: processReq.newUrl,
      };
      //   return res.status(200).json({ message: 'URL added successfully', doc: processReq.newUrl });
    } else {
      return {
        state: false,
        message: processReq.message || "server error, contact developer",
      };
      //   res.status(401).json({ message: processReq.message || "server error, contact developer" })
    }
  } catch (error) {
    console.error("Error adding URL:", error);
    return { state: false, message: "Internal server error" };
    // return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addURL };
