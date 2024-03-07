const { userData } = require("../../assets/socialData");
const authTokenModel = require("../../models/authTokens");
const { verifyRefreshTokens } = require("./verifyTokens");

const adminVerification = async (req, res, next) => {
  try {
    const validate = basicValidation(req, res);
    const refreshToken = req.headers.authorization?.split(" ")[1];

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
            .status(403)
            .json({ message: "Verification failed", state: false });
        }

        req.userid = userid;
        return next();
      }
      return res
        .status(403)
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
  const refreshToken = req.headers.authorization?.split(" ")[1];
  if (!refreshToken) {
    res.status(403).json({
      message: "token not provided",
      state: false,
    });
    return false;
  }
  return true;
};

module.exports = adminVerification;
