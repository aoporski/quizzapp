const { body, param } = require('express-validator');

const createTagValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tag name is required')
    .isLength({ max: 50 })
    .withMessage('Tag name too long'),
];

const deleteTagValidator = [param('id').isMongoId().withMessage('Invalid tag ID')];

module.exports = {
  createTagValidator,
  deleteTagValidator,
};
