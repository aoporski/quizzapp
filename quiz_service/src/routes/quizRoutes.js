const express = require('express');
const router = express.Router();
const quizzController = require('../controllers/quizController');

router.get('/me', quizzController.getMyQuizzes);
router.get('/author/:id', quizzController.getQuizzByAuthor);
router.get('/', quizzController.searchQuizzes);
router.get('/:id', quizzController.getQuizzById);
router.post('/', quizzController.createQuizz);
router.patch('/:id', quizzController.editQuizz);
router.delete('/:id', quizzController.deleteQuizz);

module.exports = router;
