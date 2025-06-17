const quizzService = require('../services/quiz');
const Quiz = require('../db/mongo/models/quizz');

const createQuizz = async (req, res) => {
  const { title, description, difficulty, duration, categories, tags, isPrivate, isPublished } =
    req.body;

  const authorId = req.user.keycloakId;

  try {
    const created = await quizzService.createQuizz(
      title,
      description,
      difficulty,
      duration,
      isPrivate,
      isPublished,
      authorId,
      categories,
      tags
    );
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating quizz:', err.message);
    res.status(500).json({ error: 'Failed to create quizz' });
  }
};

const editQuizz = async (req, res) => {
  const { title, description, difficulty, duration, categories, tags, isPrivate, isPublished } =
    req.body;

  const { id } = req.params;
  const authorId = req.user.keycloakId;

  try {
    const edited = await quizzService.editQuizz(
      id,
      title,
      description,
      difficulty,
      duration,
      isPrivate,
      isPublished,
      categories,
      tags,
      authorId
    );
    res.status(200).json(edited);
  } catch (err) {
    console.error('Error editing quizz:', err.message);
    res.status(500).json({ error: 'Failed to edit quizz' });
  }
};

const deleteQuizz = async (req, res) => {
  const { id } = req.params;
  const authorId = req.user.keycloakId;

  try {
    const deleted = await quizzService.deleteQuizz(id, authorId);
    res.status(200).json(deleted);
  } catch (err) {
    console.error('Error deleting quizz:', err.message);
    res.status(500).json({ error: 'Failed to delete quizz' });
  }
};

const searchQuizzes = async (req, res) => {
  const { category, tags, difficulty, language, keyword, sortBy, order, page, limit } = req.query;

  try {
    const results = await quizzService.searchQuizes(
      category,
      tags,
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

const getMyQuizzes = async (req, res) => {
  const userId = req.user.keycloakId;

  try {
    const quizzes = await Quiz.find({ authorId: userId });

    const quizzesWithOwnership = quizzes.map((quiz) => ({
      ...quiz.toObject(),
      isOwner: true,
    }));

    res.status(200).json(quizzesWithOwnership);
  } catch (err) {
    console.error('Error fetching my quizzes:', err.message);
    res.status(500).json({ error: 'Failed to fetch your quizzes' });
  }
};

const getQuizzById = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await quizzService.getQuizzById(id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.status(200).json(quiz);
  } catch (err) {
    console.error('Error getting quiz by id:', err.message);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};

const getQuizzByAuthor = async (req, res) => {
  try {
    const quizzes = await quizzService.getQuizzByAuthor(req.user.keycloakId);
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quizzes by author' });
  }
};

module.exports = {
  createQuizz,
  editQuizz,
  deleteQuizz,
  searchQuizzes,
  getMyQuizzes,
  getQuizzById,
  getQuizzByAuthor,
};
