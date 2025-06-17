const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const {
  completeProfileValidator,
  updateProfileValidator,
  updateMeValidator,
} = require('../validators/userValidator');
const validate = require('../middlewares/validate');

router.post(
  '/complete-profile',

  completeProfileValidator,
  validate,
  userProfileController.completeProfile
);

router.patch(
  '/update-profile',

  updateProfileValidator,
  validate,
  userProfileController.updateProfile
);

router.put(
  '/update-me',

  updateMeValidator,
  validate,
  userProfileController.updateMe
);
router.get('/get-profile', userProfileController.getProfile);
router.delete('/delete-profile', userProfileController.deleteProfile);

router.get('/me', userProfileController.getMe);
router.get('/:id', userProfileController.getUserById);
router.post('/sync', userProfileController.syncUser);

module.exports = router;
