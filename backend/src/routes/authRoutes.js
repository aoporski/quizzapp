const express = require('express');
const router = express.Router();
const passport = require('../services/userAuth/oauth');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/verify', authController.verify);

router.post('/login', authController.login);

router.post('/token/refresh', authController.refreshToken);

router.post('/reset-password/request', authController.requestPasswordReset);

router.post('/reset-password/confirm', authController.resetPassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const { user, token } = req.user;

    const isComplete = user.username && user.name && user.surname && user.country;

    const redirectUrl = isComplete
      ? `${process.env.FRONTEND_URL}/`
      : `${process.env.FRONTEND_URL}/complete-profile?token=${token}`;

    res.redirect(redirectUrl);
  }
);
module.exports = router;
