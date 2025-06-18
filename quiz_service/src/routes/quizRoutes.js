const express = require('express');
const router = express.Router();
const quizzController = require('../controllers/quizController');
const validate = require('../middlewares/validate');
const { createQuizValidator, editQuizValidator } = require('../validators/quizValidator');

router.get('/me', quizzController.getMyQuizzes);
router.get('/author/:id', quizzController.getQuizzByAuthor);
router.get('/', quizzController.searchQuizzes);
router.get('/:id', quizzController.getQuizzById);
router.post('/', createQuizValidator, validate, quizzController.createQuizz);
router.patch('/:id', editQuizValidator, validate, quizzController.editQuizz);
router.delete('/:id', quizzController.deleteQuizz);

module.exports = router;
