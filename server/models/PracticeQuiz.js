const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true } // index into options
});

const PracticeQuizSchema = new mongoose.Schema({
  topic: { type: String, required: true, unique: true },
  questions: [QuestionSchema]
}, { timestamps: true });

module.exports = mongoose.model('PracticeQuiz', PracticeQuizSchema);
