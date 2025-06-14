const {
  startSession,
  saveAnswer,
  pauseSession,
  resumeSession,
  completeSession,
  getUserStats,
  getUserHistory,
} = require('../services/session');

exports.start = async (req, res, next) => {
  try {
    const session = await startSession(req.user.keycloakId, req.params.quizId);
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};

exports.answer = async (req, res, next) => {
  try {
    const { questionId, response } = req.body;
    const session = await saveAnswer(req.user.keycloakId, req.params.quizId, questionId, response);
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};

exports.pause = async (req, res, next) => {
  try {
    await pauseSession(req.user.keycloakId, req.params.quizId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.resume = async (req, res, next) => {
  try {
    const session = await resumeSession(req.user.keycloakId, req.params.quizId);
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};

exports.complete = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const result = await completeSession(req.user.keycloakId, req.params.quizId, token);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.history = async (req, res, next) => {
  try {
    const data = await getUserHistory(req.user.keycloakId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.stats = async (req, res, next) => {
  try {
    const data = await getUserStats(req.user.keycloakId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
