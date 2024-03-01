const mongoose = require('mongoose');
const { URlmodelStruc } = require('../urlModelStructure');
const urlSchema = new mongoose.Schema(URlmodelStruc);

const RitikBkl = mongoose.model('ritikBkl', urlSchema);

module.exports = RitikBkl;
