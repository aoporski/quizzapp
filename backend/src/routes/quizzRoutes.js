const express = require('express');
const router = express.Router();
const quizzController = require('../controllers/quizzController');
const verifyAccessToken = require('../middlewares/auth');

router.post('/create', verifyAccessToken, quizzController.createQuizz);
router.patch('/edit', verifyAccessToken, quizzController.editQuizz);
router.delete('/delete', verifyAccessToken, quizzController.deleteQuizz);

module.exports = router;
