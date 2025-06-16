const Category = require('../db/mongo/models/category');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parentCategory');
    res.json(categories);
  } catch (err) {
    console.error('Error getting categories:', err.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parentCategory');
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    console.error('Error getting category by id:', err.message);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;
    const category = new Category({ name, parentCategory: parentCategory || null });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error('Error creating category:', err.message);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, parentCategory: parentCategory || null },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating category:', err.message);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting category:', err.message);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
