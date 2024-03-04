const { userData } = require("../../assets/socialData");
const authTokenModel = require("../../models/authTokens");
const { verifyRefreshTokens } = require("./verifyTokens");

const adminVerification = async (req, res, next) => {
  try {
    const validate = basicValidation(req, res);
    const refreshToken = req.headers.refreshtoken;
    const { appId } = req.query;
    if (validate) {
      const verifyRefresh = await verifyRefreshTokens(refreshToken);

      if (
        verifyRefresh &&
        verifyRefresh.verified &&
        verifyRefresh.verifyToken
      ) {
        const userid = verifyRefresh?.verifyToken?.userid;
        const user = await authTokenModel.findOne({ userid });
        if (user.token !== refreshToken) {
          return res
            .status(401)
            .json({ message: "Verification failed", state: false });
        }
        const userApps = userData[userid];
        const isValidReq = userApps.apps.find((item) => {
          return item === appId;
        });

        if (!isValidReq) {
          return res
            .status(401)
            .json({ message: "This is not your app", state: false });
        }
        return next();
      }
      return res
        .status(401)
        .json({ message: "Verification failed", state: false });
    }
    return res;
  } catch (error) {
    return res.json({
      message: serverError("", res),
    });
  }
};

const basicValidation = (req, res) => {
  const refreshToken = req.headers.refreshtoken;
  if (!refreshToken) {
    res.status(401).json({
      message: "token not provided",
      state: false,
    });
    return false;
  }
  return true;
};

module.exports = adminVerification;
