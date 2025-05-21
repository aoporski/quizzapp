const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  avatar: String,
  bio: String,
  stats: {
    quizzesTaken: { type: Number, default: 0 },
    quizzesCreated: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
  },
  privacy: {
    showStats: { type: Boolean, default: true },
    searchable: { type: Boolean, default: true },
    allowFriendRequests: { type: Boolean, default: true },
  },
});

module.exports = mongoose.model('UserProfile', userProfileSchema);