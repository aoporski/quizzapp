const Redis = require('ioredis');
const Session = require('../db/mongo/models/Session');
const Question = require('../db/mongo/models/Question');
const redis = new Redis({ host: process.env.REDIS_HOST || 'redis', port: 6379 });
const mongoose = require('mongoose');

const getSessionKey = (userId, quizId) => `quiz-session:${userId}:${quizId}`;
const axios = require('axios');

async function getQuestionMeta(questionId, token) {
  const res = await axios.get(`http://gateway:3001/api/quiz/question/${questionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
async function startSession(userId, quizId) {
  const key = getSessionKey(userId, quizId);
  const existing = await redis.get(key);
  if (existing) return JSON.parse(existing);

  const newSession = {
    userId,
    quizId,
    answers: [],
    status: 'in_progress',
    startedAt: Date.now(),
  };

  await redis.set(key, JSON.stringify(newSession), 'EX', 3600);
  return newSession;
}

async function saveAnswer(userId, quizId, questionId, response) {
  const key = getSessionKey(userId, quizId);
  const session = JSON.parse(await redis.get(key));
  if (!session || session.status !== 'in_progress') throw new Error('No active session');

  const existing = session.answers.find((a) => a.questionId === questionId);
  if (existing) {
    existing.response = response;
  } else {
    session.answers.push({ questionId, response });
  }

  await redis.set(key, JSON.stringify(session), 'EX', 3600);
  return session;
}

async function pauseSession(userId, quizId) {
  const key = getSessionKey(userId, quizId);
  const session = JSON.parse(await redis.get(key));
  if (!session) throw new Error('No session to pause');

  session.status = 'paused';
  await redis.set(key, JSON.stringify(session), 'EX', 3600);
}

async function resumeSession(userId, quizId) {
  const key = getSessionKey(userId, quizId);
  const session = JSON.parse(await redis.get(key));
  if (!session || session.status !== 'paused') throw new Error('No paused session to resume');

  session.status = 'in_progress';
  await redis.set(key, JSON.stringify(session), 'EX', 3600);
  return session;
}

async function evaluateSession(session, token) {
  let score = 0;

  console.log('[EVALUATE] Total answers:', session.answers.length);

  for (const ans of session.answers) {
    console.log('[EVALUATE] Checking:', ans);

    try {
      const { correctAnswers, points } = await getQuestionMeta(ans.questionId, token);

      const correct = Array.isArray(correctAnswers)
        ? correctAnswers.map(String).includes(String(ans.response))
        : String(correctAnswers) === String(ans.response);

      console.log('[EVALUATE] Is correct:', correct);
      if (correct) score += points || 1;
    } catch (err) {
      console.warn(`[EVALUATE] Failed to get question meta for ${ans.questionId}:`, err.message);
    }
  }

  console.log('[EVALUATE] Final score:', score);
  return score;
}
async function completeSession(userId, quizId, token) {
  const key = getSessionKey(userId, quizId);
  const session = JSON.parse(await redis.get(key));
  if (!session) throw new Error('No session to complete');

  const score = await evaluateSession(session, token);

  const sessionDoc = new Session({
    userId,
    quizId,
    answers: session.answers,
    score,
    status: 'completed',
    startedAt: session.startedAt,
    completedAt: new Date(),
  });

  await sessionDoc.save();
  await redis.del(key);

  return {
    score,
    total: session.answers.length,
    percentage: session.answers.length > 0 ? Math.round((score / session.answers.length) * 100) : 0,
    duration: Math.round((sessionDoc.completedAt - sessionDoc.startedAt) / 1000),
  };
}

async function getUserHistory(userId) {
  const sessions = await Session.find({ userId }).sort({ completedAt: -1 });

  return sessions.map((s) => ({
    quizId: s.quizId,
    score: s.score,
    total: s.answers.length,
    percentage: Math.round((s.score / s.answers.length) * 100),
    completedAt: s.completedAt,
  }));
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

  const validSessions = sessions.filter((s) => s.answers.length > 0);

  const scoresPercent = validSessions.map((s) => s.score / s.answers.length);
  const averageScore = scoresPercent.length
    ? Math.round((scoresPercent.reduce((a, b) => a + b, 0) / scoresPercent.length) * 100)
    : 0;
  const bestScore = scoresPercent.length ? Math.round(Math.max(...scoresPercent) * 100) : 0;

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
module.exports = {
  startSession,
  saveAnswer,
  pauseSession,
  resumeSession,
  completeSession,
  getUserHistory,
  getUserStats,
};
