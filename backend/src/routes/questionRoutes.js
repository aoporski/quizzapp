const express = require('express');
const questionController = require('../controllers/questionController');
const verifyAccessToken = require('../middlewares/auth');

const router = express.Router();

router.post('/', verifyAccessToken, questionController.addQuestion);
router.patch('/:id', verifyAccessToken, questionController.editQuestion);
router.delete('/:id', verifyAccessToken, questionController.deleteQuestion);

module.exports = router;
