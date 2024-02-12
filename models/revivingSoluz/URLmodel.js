const mongoose = require('mongoose');
const { URlmodelStruc } = require('../urlModelStructure');
const urlSchema = new mongoose.Schema(URlmodelStruc);

const UrlModel = mongoose.model('revisingSoulz', urlSchema);

module.exports = UrlModel;
