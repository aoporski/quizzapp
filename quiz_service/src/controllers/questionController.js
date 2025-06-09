const questionService = require('../services/question');

const addQuestion = async (req, res) => {
  const { quizId, type, text, options, correctAnswers, points, hint } = req.body;
  const authorId = req.user.keycloakId;

  try {
    const created = await questionService.addQuestion(
      quizId,
      type,
      text,
      options,
      correctAnswers,
      points,
      hint,
      authorId
    );
    res.status(201).json(created);
  } catch (err) {
    console.error('Error adding question:', err.message);
    res.status(500).json({ error: 'Failed to add question' });
  }
};

const editQuestion = async (req, res) => {
  const { id } = req.params;
  const { type, text, options, correctAnswers, points, hint } = req.body;
  const authorId = req.user.keycloakId;

  try {
    const edited = await questionService.editQuestion(
      id,
      type,
      text,
      options,
      correctAnswers,
      points,
      hint,
      authorId
    );
    res.status(200).json(edited);
  } catch (err) {
    console.error('Error editing question:', err.message);
    res.status(500).json({ error: 'Failed to edit question' });
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  const authorId = req.user.keycloakId;

  try {
    await questionService.deleteQuestion(id, authorId);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting question:', err.message);
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

const getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await questionService.getQuestionById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (err) {
    console.error('Error getting question:', err.message);
    res.status(500).json({ error: 'Failed to get question' });
  }
};

const getQuestionsForQuiz = async (req, res) => {
  const { quizId } = req.query;
  try {
    const questions = await questionService.getQuestionsForQuiz(quizId);
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    res.status(500).json({ error: 'Failed to get questions' });
  }
};

module.exports = {
  addQuestion,
  editQuestion,
  deleteQuestion,
  getQuestionById,
  getQuestionsForQuiz,
};
