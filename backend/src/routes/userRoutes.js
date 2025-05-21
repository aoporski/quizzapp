const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const verifyAccessToken = require('../middlewares/auth');

router.post('/complete-profile', verifyAccessToken, userProfileController.completeProfile);
router.get('/get-profile', verifyAccessToken, userProfileController.getProfile);
router.patch('/update-profile', verifyAccessToken, userProfileController.updateProfile);
router.delete('/delete-profile', verifyAccessToken, userProfileController.deleteProfile);

module.exports = router;
