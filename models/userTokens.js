const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    pageName: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
    },

}, { timestamps: true });

const userTokenModel = mongoose.model('token', urlSchema);

module.exports = userTokenModel;
