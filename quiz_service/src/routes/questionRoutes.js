const express = require('express');
const questionController = require('../controllers/questionController');
const router = express.Router();
const {
  getQuestionsValidator,
  getQuestionByIdValidator,
  createQuestionValidator,
  editQuestionValidator,
  deleteQuestionValidator,
} = require('../validators/questionValidator');
const validate = require('../middlewares/validate');

router.get('/', getQuestionsValidator, validate, questionController.getQuestionsForQuiz);
router.get('/:id', getQuestionByIdValidator, validate, questionController.getQuestionById);
router.post('/', createQuestionValidator, validate, questionController.addQuestion);
router.patch('/:id', editQuestionValidator, validate, questionController.editQuestion);
router.delete('/:id', deleteQuestionValidator, validate, questionController.deleteQuestion);

module.exports = router;
