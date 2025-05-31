const questionService = require('../services/question');

const addQuestion = async (req, res) => {
  const { quizId, type, text, options, correctAnswers, points, hint } = req.body;

  try {
    const created = await questionService.addQuestion(
      quizId,
      type,
      text,
      options,
      correctAnswers,
      points,
      hint
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

  try {
    const edited = await questionService.editQuestion(
      id,
      type,
      text,
      options,
      correctAnswers,
      points,
      hint
    );
    res.status(200).json(edited);
  } catch (err) {
    console.error('Error editing question:', err.message);
    res.status(500).json({ error: 'Failed to edit question' });
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    await questionService.deleteQuestion(id);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting question:', err.message);
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

module.exports = { addQuestion, editQuestion, deleteQuestion };
