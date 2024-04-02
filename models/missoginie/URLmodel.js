const mongoose = require("mongoose");
const { URlmodelStruc } = require("../urlModelStructure");
const urlSchema = new mongoose.Schema(URlmodelStruc);

const MissoGinieModel = mongoose.model("missoginie", urlSchema);

module.exports = MissoGinieModel;
