const Tag = require('../db/mongo/models/tag');

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    console.error('Error getting tags:', err.message);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = new Tag({ name });
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    console.error('Error creating tag:', err.message);
    res.status(500).json({ error: 'Failed to create tag' });
  }
};

const deleteTag = async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting tag:', err.message);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
};

module.exports = { getAllTags, createTag, deleteTag };
