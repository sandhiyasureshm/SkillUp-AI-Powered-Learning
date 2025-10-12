const mongoose = require("mongoose");

const practiceSchema = new mongoose.Schema({
  title: { type: String, required: true }
});

module.exports = mongoose.model("Practice", practiceSchema);
