const {
  startSession,
  saveAnswer,
  pauseSession,
  resumeSession,
  completeSession,
} = require('../services/session');

exports.start = async (req, res, next) => {
  try {
    const session = await startSession(req.user.id, req.params.quizId);
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};

exports.answer = async (req, res, next) => {
  try {
    const { questionId, response } = req.body;
    const session = await saveAnswer(req.user.id, req.params.quizId, questionId, response);
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};

exports.pause = async (req, res, next) => {
  try {
    await pauseSession(req.user.id, req.params.quizId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.resume = async (req, res, next) => {
  try {
    const session = await resumeSession(req.user.id, req.params.quizId);
    res.status(200).json(session);
  } catch (err) {
    next(err);
  }
};

exports.complete = async (req, res, next) => {
  try {
    const result = await completeSession(req.user.id, req.params.quizId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
