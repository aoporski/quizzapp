const express = require('express');
const router = express.Router();
const quizSessionController = require('../controllers/sessionController');
const verifyAccessToken = require('../middlewares/verifyKeycloakToken');

router.post('/start/:quizId', verifyAccessToken, quizSessionController.start);
router.post('/:quizId/answer', verifyAccessToken, quizSessionController.answer);
router.post('/:quizId/pause', verifyAccessToken, quizSessionController.pause);
router.post('/:quizId/resume', verifyAccessToken, quizSessionController.resume);
router.post('/:quizId/complete', verifyAccessToken, quizSessionController.complete);

module.exports = router;
