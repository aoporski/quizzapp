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

const searchQuizValidator = [
  query('category').optional().isMongoId(),
  query('tags').optional().isString(),
  query('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  query('language').optional().isString(),
  query('keyword').optional().isString(),
  query('sortBy').optional().isString(),
  query('order').optional().isIn(['asc', 'desc']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1 }),
];

module.exports = {
  createQuizValidator,
  editQuizValidator,
  searchQuizValidator,
};
