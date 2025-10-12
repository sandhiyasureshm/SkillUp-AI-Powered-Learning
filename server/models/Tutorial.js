const mongoose = require("mongoose");

const tutorialSchema = new mongoose.Schema({
  title: { type: String, required: true }
});

module.exports = mongoose.model("Tutorial", tutorialSchema);
