const mongoose = require('mongoose');

const CodingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy','Medium','Hard'], default: 'Easy' },
  description: { type: String, required: true },
  sampleInput: { type: String, default: '' },
  sampleOutput: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('CodingProblem', CodingProblemSchema);
