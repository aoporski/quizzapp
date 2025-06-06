const Redis = require('ioredis');
const Session = require('../db/mongo/models/Session');
const Question = require('../db/mongo/models/Question');
const redis = new Redis({ host: process.env.REDIS_HOST || 'redis', port: 6379 });

const getSessionKey = (userId, quizId) => `quiz-session:${userId}:${quizId}`;

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

async function evaluateSession(session) {
  let score = 0;

  for (const ans of session.answers) {
    const q = await Question.findById(ans.questionId);
    if (!q) continue;
    const correct = Array.isArray(q.correctAnswers)
      ? q.correctAnswers.includes(ans.response)
      : q.correctAnswers === ans.response;
    if (correct) score += q.points || 1;
  }

  return score;
}

async function completeSession(userId, quizId) {
  const key = getSessionKey(userId, quizId);
  const session = JSON.parse(await redis.get(key));
  if (!session) throw new Error('No session to complete');

  const score = await evaluateSession(session);

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
  return sessionDoc;
}

module.exports = {
  startSession,
  saveAnswer,
  pauseSession,
  resumeSession,
  completeSession,
};
