const express = require('express');
const router = express.Router();
const quizSessionController = require('../controllers/sessionController');
const { saveAnswerValidator, quizIdOnlyValidator } = require('../validators/sessionValidator');
const { validate } = require('../middlewares/validate');

router.post('/start/:quizId', quizIdOnlyValidator, validate, quizSessionController.start);
router.post('/:quizId/answer', saveAnswerValidator, validate, quizSessionController.answer);
router.post('/:quizId/pause', quizIdOnlyValidator, validate, quizSessionController.pause);
router.post('/:quizId/resume', quizIdOnlyValidator, validate, quizSessionController.resume);
router.post('/:quizId/complete', quizIdOnlyValidator, validate, quizSessionController.complete);

router.get('/history', quizSessionController.history);
router.get('/stats', quizSessionController.stats);
router.get('/stats/trend', quizSessionController.getUserTrend);
router.get('/stats/author/:id', quizSessionController.getAuthorStats);

module.exports = router;
