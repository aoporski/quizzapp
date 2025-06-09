const express = require('express');
const questionController = require('../controllers/questionController');
const verifyAccessToken = require('../middlewares/verifyKeycloakToken');

const router = express.Router();

router.get('/', verifyAccessToken, questionController.getQuestionsForQuiz);
router.get('/:id', verifyAccessToken, questionController.getQuestionById);
router.post('/', verifyAccessToken, questionController.addQuestion);
router.patch('/:id', verifyAccessToken, questionController.editQuestion);
router.delete('/:id', verifyAccessToken, questionController.deleteQuestion);

module.exports = router;
