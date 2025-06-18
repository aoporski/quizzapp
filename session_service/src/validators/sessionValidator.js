const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const quizIdParam = [param('quizId').custom(isValidObjectId).withMessage('Invalid quizId')];

const saveAnswerValidator = [
  ...quizIdParam,
  body('questionId')
    .notEmpty()
    .withMessage('questionId is required')
    .custom(isValidObjectId)
    .withMessage('Invalid questionId'),
  body('response').not().isEmpty().withMessage('Response is required'),
];

module.exports = {
  saveAnswerValidator,
  quizIdOnlyValidator,
};
