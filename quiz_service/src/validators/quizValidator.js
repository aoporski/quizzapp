const { body, param, query } = require('express-validator');

const createQuizValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('isPrivate').optional().isBoolean().withMessage('isPrivate must be boolean'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be boolean'),
  body('categories').optional().isArray(),
  body('tags').optional().isArray(),
];

const editQuizValidator = [
  param('id').isMongoId().withMessage('Invalid quiz ID'),
  ...createQuizValidator,
];

module.exports = {
  createQuizValidator,
  editQuizValidator,
};
