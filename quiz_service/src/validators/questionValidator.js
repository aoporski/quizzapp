const { body, param, query } = require('express-validator');

const getQuestionsValidator = [
  query('quizId').isMongoId().withMessage('quizId must be a valid Mongo ID'),
];

const getQuestionByIdValidator = [param('id').isMongoId().withMessage('Invalid question ID')];

const createQuestionValidator = [
  body('quizId').isMongoId().withMessage('quizId must be a valid Mongo ID'),
  body('type')
    .isIn(['single-choice', 'multiple-choice', 'true-false', 'open-ended'])
    .withMessage('Invalid question type'),
  body('text').notEmpty().withMessage('Text is required'),
  body('options').optional().isArray().withMessage('Options must be an array'),
  body('correctAnswers')
    .isArray({ min: 1 })
    .withMessage('correctAnswers must be a non-empty array'),
  body('points').isNumeric().withMessage('Points must be a number'),
  body('hint').optional().isString(),
];

const editQuestionValidator = [
  param('id').isMongoId().withMessage('Invalid question ID'),
  body('type').optional().isIn(['single-choice', 'multiple-choice', 'true-false', 'open-ended']),
  body('text').optional().isString(),
  body('options').optional().isArray(),
  body('correctAnswers').optional().isArray({ min: 1 }),
  body('points').optional().isNumeric(),
  body('hint').optional().isString(),
];

const deleteQuestionValidator = [param('id').isMongoId().withMessage('Invalid question ID')];

module.exports = {
  getQuestionsValidator,
  getQuestionByIdValidator,
  createQuestionValidator,
  editQuestionValidator,
  deleteQuestionValidator,
};
