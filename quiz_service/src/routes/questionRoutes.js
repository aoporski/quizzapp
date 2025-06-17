const express = require('express');
const questionController = require('../controllers/questionController');

const router = express.Router();

router.get('/', questionController.getQuestionsForQuiz);
router.get('/:id', questionController.getQuestionById);
router.post('/', questionController.addQuestion);
router.patch('/:id', questionController.editQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
