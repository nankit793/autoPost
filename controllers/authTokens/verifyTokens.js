const jwt = require("jsonwebtoken");
JWT_REFRESH_TOKEN_SECRET =
  "5da58c6bbf7927d5d96bdc42b573d478495d730edcbb87cc5649a41e43756b54";
const verifyAccessToken = async (accessToken) => {
  try {
    const verifyToken = await jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET);
    return { verified: true, verifyToken };
  } catch (error) {
    if (error.message === "jwt expired") {
      return { verified: false, generateNew: true };
    }
    return { verified: false, generateNew: false };
  }
};
const verifyRefreshTokens = async (refreshToken) => {
  try {
    const verifyToken = await jwt.verify(
      refreshToken,
      JWT_REFRESH_TOKEN_SECRET
    );
    return { verified: true, verifyToken };
  } catch (error) {
    return { verified: false };
  }
};

module.exports = {
  verifyAccessToken,
  verifyRefreshTokens,
};
