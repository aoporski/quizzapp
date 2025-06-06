const express = require('express');
const router = express.Router();
const quizSessionController = require('../controllers/sessionController');
const authenticate = require('../middlewares/auth');

router.post('/start/:quizId', authenticate, quizSessionController.start);
router.post('/:quizId/answer', authenticate, quizSessionController.answer);
router.post('/:quizId/pause', authenticate, quizSessionController.pause);
router.post('/:quizId/resume', authenticate, quizSessionController.resume);
router.post('/:quizId/complete', authenticate, quizSessionController.complete);

module.exports = router;
