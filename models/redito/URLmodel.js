const mongoose = require('mongoose');
const { URlmodelStruc } = require('../urlModelStructure');
const urlSchema = new mongoose.Schema(URlmodelStruc);

const ReditoModel = mongoose.model('ReditoModel', urlSchema);

module.exports = ReditoModel;
