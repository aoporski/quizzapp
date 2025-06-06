const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

const quizSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quizz',
      required: true,
    },
    answers: [answerSchema],

    score: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ['in_progress', 'paused', 'completed'],
      default: 'in_progress',
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', quizSessionSchema);
