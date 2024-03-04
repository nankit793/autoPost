const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const authTokenModel = mongoose.model("authToken", urlSchema);

module.exports = authTokenModel;
