const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyAccessToken = require('../middlewares/verifyKeycloakToken');

router.get('/', verifyAccessToken, categoryController.getAllCategories);

router.get('/:id', verifyAccessToken, categoryController.getCategoryById);

router.post('/', verifyAccessToken, categoryController.createCategory);

router.put('/:id', verifyAccessToken, categoryController.updateCategory);

router.delete('/:id', verifyAccessToken, categoryController.deleteCategory);

module.exports = router;
