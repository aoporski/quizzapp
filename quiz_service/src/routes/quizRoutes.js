const express = require('express');
const router = express.Router();
const quizzController = require('../controllers/quizController');
const verifyAccessToken = require('../middlewares/verifyKeycloakToken');

router.get('/me', verifyAccessToken, quizzController.getMyQuizzes);
router.get('/', verifyAccessToken, quizzController.searchQuizzes);
router.get('/:id', verifyAccessToken, quizzController.getQuizzById);
router.post('/', verifyAccessToken, quizzController.createQuizz);
router.patch('/:id', verifyAccessToken, quizzController.editQuizz);
router.delete('/', verifyAccessToken, quizzController.deleteQuizz);

module.exports = router;
