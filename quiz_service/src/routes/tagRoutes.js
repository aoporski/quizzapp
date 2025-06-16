const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const verifyAccessToken = require('../middlewares/verifyKeycloakToken');

router.get('/', verifyAccessToken, tagController.getAllTags);

router.post('/', verifyAccessToken, tagController.createTag);

router.delete('/:id', verifyAccessToken, tagController.deleteTag);

module.exports = router;
