const express = require('express');
const router = express.Router();
const quizSessionController = require('../controllers/sessionController');

router.post('/start/:quizId', quizSessionController.start);
router.post('/:quizId/answer', quizSessionController.answer);
router.post('/:quizId/pause', quizSessionController.pause);
router.post('/:quizId/resume', quizSessionController.resume);
router.post('/:quizId/complete', quizSessionController.complete);
router.get('/history', quizSessionController.history);
router.get('/stats', quizSessionController.stats);

module.exports = router;
