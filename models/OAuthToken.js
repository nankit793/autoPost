const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
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
    token_type: {
        type: String,
        required: true,
    },
    scope: {
        type: String,
        required: true,
    },

}, { timestamps: true });

const OAuthTokens = mongoose.model('OAuthTokens', tokenSchema);

module.exports = OAuthTokens;
