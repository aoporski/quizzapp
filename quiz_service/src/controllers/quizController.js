const quizzService = require('../services/quiz');

const createQuizz = async (req, res) => {
  const { title, description, difficulty, duration, isPrivate, isPublished } = req.body;
  const authorId = req.user.id;
  try {
    const created = await quizzService.createQuizz(
      title,
      description,
      difficulty,
      duration,
      isPrivate,
      isPublished,
      authorId
    );
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating quizz:', err.message);
    res.status(500).json({ error: 'Failed to create quizz' });
  }
};

const editQuizz = async (req, res) => {
  const { title, description, difficulty, duration, isPrivate, isPublished } = req.body;
  const { id } = req.params;
  try {
    const edited = await quizzService.editQuizz(
      id,
      title,
      description,
      difficulty,
      duration,
      isPrivate,
      isPublished
    );
    res.status(201).json(edited);
  } catch (err) {
    console.error('Error editing quizz:', err.message);
    res.status(500).json({ error: 'Failed to edit quizz' });
  }
};

const deleteQuizz = async (req, res) => {
  const id = req.params;
  try {
    const deleted = await quizzService.deleteQuizz(id);
    res.status(200).json(deleted);
  } catch (err) {
    console.error('Error deleting quizz:', err.message);
    res.status(500).json({ error: 'Failed to delete quizz' });
  }
};

const searchQuizzes = async (req, res) => {
  const { category, difficulty, language, keyword, sortBy, order, page, limit } = req.query;

  try {
    const results = await quizzService.searchQuizes(
      category,
      difficulty,
      language,
      keyword,
      sortBy,
      order,
      page,
      limit
    );
    res.status(200).json(results);
  } catch (err) {
    console.error('Error searching quizzes:', err.message);
    res.status(500).json({ error: 'Failed to search quizzes' });
  }
};

module.exports = {
  createQuizz,
  editQuizz,
  deleteQuizz,
  searchQuizzes,
};
