const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const validate = require('../middlewares/validate');
const { createTagValidator, deleteTagValidator } = require('../validators/tagValidator');

router.get('/', tagController.getAllTags);
router.post('/', createTagValidator, validate, tagController.createTag);
router.delete('/:id', deleteTagValidator, validate, tagController.deleteTag);

module.exports = router;
