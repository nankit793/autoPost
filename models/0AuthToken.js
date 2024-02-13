const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    pageName: {
        type: String,
        required: true,
        unique: true
    },
    access_token: {
        type: String,
        required: true,
    },
    expiry_date: {
        type: String,
        required: true,
    },

    refresh_token: {
        type: String,
        required: true,
    },

}, { timestamps: true });

const userTokenModel = mongoose.model('token', urlSchema);

module.exports = userTokenModel;
