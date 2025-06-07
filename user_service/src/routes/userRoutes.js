const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
// const verifyAccessToken = require('../middlewares/auth');
const verifyAccessToken = require('../middlewares/verifyKeycloakToken');

router.post('/complete-profile', verifyAccessToken, userProfileController.completeProfile);
router.get('/get-profile', verifyAccessToken, userProfileController.getProfile);
router.patch('/update-profile', verifyAccessToken, userProfileController.updateProfile);
router.delete('/delete-profile', verifyAccessToken, userProfileController.deleteProfile);

router.get('/me', verifyAccessToken, userProfileController.getMe);
router.put('/update-me', verifyAccessToken, userProfileController.updateMe);
router.post('/sync', verifyAccessToken, userProfileController.syncUser);

module.exports = router;
