const Redis = require('ioredis');
const Session = require('../db/mongo/models/Session');
const Question = require('../db/mongo/models/Question');
const redis = new Redis({ host: process.env.REDIS_HOST || 'redis', port: 6379 });
const mongoose = require('mongoose');

const getSessionKey = (userId, quizId) => `quiz-session:${userId}:${quizId}`;
const axios = require('axios');

const { getQuestionMeta } = require('../../src/utils/quizApi');

async function getUserHistory(userId) {
  const sessions = await Session.find({ userId }).sort({ completedAt: -1 });

  const results = await Promise.all(
    sessions.map(async (s) => {
      let maxPoints = 0;

      for (const a of s.answers) {
        try {
          const { points } = await getQuestionMeta(a.questionId);
          maxPoints += points || 1;
        } catch {
          maxPoints += 1;
        }
      }

      return {
        quizId: s.quizId,
        score: s.score,
        total: maxPoints,
        percentage: maxPoints > 0 ? Math.round((s.score / maxPoints) * 100) : 0,
        completedAt: s.completedAt,
      };
    })
  );

  return results;
}

async function getUserStats(userId) {
  const sessions = await Session.find({ userId });

  if (!sessions.length) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      mostRecentQuiz: null,
    };
  }

  const percentScores = [];

  for (const s of sessions) {
    let maxPoints = 0;

    for (const a of s.answers) {
      try {
        const { points } = await getQuestionMeta(a.questionId);
        maxPoints += points || 1;
      } catch {
        maxPoints += 1;
      }
    }

    if (maxPoints > 0) percentScores.push(s.score / maxPoints);
  }

  const averageScore = percentScores.length
    ? Math.round((percentScores.reduce((a, b) => a + b, 0) / percentScores.length) * 100)
    : 0;
  const bestScore = percentScores.length ? Math.round(Math.max(...percentScores) * 100) : 0;

  const mostRecentQuiz =
    sessions.filter((s) => s.completedAt).sort((a, b) => b.completedAt - a.completedAt)[0]
      ?.quizId || null;

  return {
    totalQuizzes: sessions.length,
    averageScore,
    bestScore,
    mostRecentQuiz,
  };
}

async function getUserTrend(userId, token) {
  const sessions = await Session.find({ userId, completedAt: { $exists: true } })
    .sort({ completedAt: -1 })
    .limit(10);

  const results = await Promise.all(
    sessions.map(async (s) => {
      let maxPoints = 0;

      for (const a of s.answers) {
        try {
          const { points } = await getQuestionMeta(a.questionId, token);
          maxPoints += points || 1;
        } catch {
          maxPoints += 1;
        }
      }

      return {
        quizId: s.quizId,
        score: s.score,
        total: maxPoints,
        percentage: maxPoints > 0 ? Math.round((s.score / maxPoints) * 100) : 0,
        completedAt: s.completedAt,
      };
    })
  );

  return results;
}
const { getAuthorIdMeta } = require('../utils/quizApi');

async function getAuthorStats(creatorId, token) {
  const quizzes = await getAuthorIdMeta(creatorId, token);

  const stats = await Promise.all(
    quizzes.map(async (quiz) => {
      const sessions = await Session.find({ quizId: quiz._id, completedAt: { $exists: true } });

      let totalScore = 0;
      let maxTotal = 0;
      const questionStats = {};

      for (const s of sessions) {
        let maxPoints = 0;

        for (const a of s.answers) {
          try {
            const { correctAnswers, points } = await getQuestionMeta(a.questionId, token);
            const isCorrect = Array.isArray(correctAnswers)
              ? correctAnswers.map(String).includes(String(a.response))
              : String(correctAnswers) === String(a.response);

            if (!questionStats[a.questionId]) {
              questionStats[a.questionId] = { correct: 0, total: 0 };
            }

            if (isCorrect) questionStats[a.questionId].correct++;
            questionStats[a.questionId].total++;

            maxPoints += points || 1;
          } catch {
            maxPoints += 1;
          }
        }

        totalScore += s.score;
        maxTotal += maxPoints;
      }

      const averageScore = maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 0;

      let hardest = null;
      for (const [qId, data] of Object.entries(questionStats)) {
        const rate = data.correct / data.total;
        if (!hardest || rate < hardest.rate) {
          hardest = { questionId: qId, correctRate: rate };
        }
      }

      return {
        quizId: quiz._id,
        title: quiz.title,
        totalCompletions: sessions.length,
        averageScore,
        hardestQuestion: hardest,
      };
    })
  );

  return stats;
}

module.exports = {
  getUserHistory,
  getUserStats,
  getUserTrend,
  getAuthorStats,
};
