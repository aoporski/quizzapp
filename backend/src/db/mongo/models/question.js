const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  type: {
    type: String,
    enum: ['single-choice', 'multiple-choice', 'true-false', 'open-ended'],
    required: true
  },
  text: { type: String, required: true },
  options: [String], // tylko dla wyboru
  correctAnswers: [String], // obsługuje wszystkie typy
  points: { type: Number, default: 1 },
  hint: String,
  explanation: String
});

module.exports = mongoose.model('Question', questionSchema);