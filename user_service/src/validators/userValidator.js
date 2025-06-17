const { body } = require('express-validator');

const completeProfileValidator = [
  body('preferred_username').isString().notEmpty().withMessage('Username is required'),
  body('firstName').isString().notEmpty().withMessage('First name is required'),
  body('lastName').isString().notEmpty().withMessage('Last name is required'),
];

const updateProfileValidator = [
  body('bio').optional().isString(),
  body('privacy').optional().isObject(),
  body('privacy.showStats').optional().isBoolean(),
];

const updateMeValidator = [
  body('preferred_username').optional().isString(),
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('bio').optional().isString(),
  body('privacy').optional().isObject(),
  body('privacy.showStats').optional().isBoolean(),
];

module.exports = {
  completeProfileValidator,
  updateProfileValidator,
  updateMeValidator,
};
