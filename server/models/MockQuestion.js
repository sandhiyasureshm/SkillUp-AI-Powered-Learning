const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  topic: String,
  level: { type: String, enum: ['Easy', 'Normal', 'Hard'] },
  question: String,
  options: [String],
  correctAnswer: String,
  source: { type: String, default: 'DB' }
});

module.exports = mongoose.model('Question', questionSchema);
