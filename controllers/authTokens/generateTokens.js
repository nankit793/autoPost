const jwt = require("jsonwebtoken");
JWT_REFRESH_TOKEN_SECRET =
  "5da58c6bbf7927d5d96bdc42b573d478495d730edcbb87cc5649a41e43756b54";
const generateAccessToken = async (payload) => {
  try {
    const options = {
      expiresIn: `30d`,
    };
    const authToken = await jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, options);
    return authToken;
  } catch (error) {
    return null;
  }
};
const generateRefreshToken = async (payload) => {
  try {
    const options = {
      expiresIn: `30d`,
    };
    const authToken = await jwt.sign(
      payload,
      JWT_REFRESH_TOKEN_SECRET,
      options
    );
    return authToken;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
