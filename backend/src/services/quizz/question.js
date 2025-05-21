const Question = require('../../db/mongo/models/question');

async function addQuestion(quizId, type, text, options, correctAnswers, points, hint) {
  const question = new Question({ quizId, type, text, options, correctAnswers, points, hint });
  try {
    await question.save();
    return question;
  } catch (err) {
    console.error('Error adding question', err.message);
    throw err;
  }
}

async function editQuestion(id, type, text, options, correctAnswers, points, hint) {
  try {
    const edited = await Question.findByIdAndUpdate(
      id,
      { type, text, options, correctAnswers, points, hint },
      { new: true }
    );
    return edited;
  } catch (err) {
    console.error('Error editing question', err.message);
    throw err;
  }
}

async function deleteQuestion(questionId) {
  try {
    const deleted = await Question.findByIdAndDelete(questionId);
    return deleted;
  } catch (err) {
    console.error('Error deleting question', err.message);
    throw err;
  }
}

module.exports = { addQuestion, editQuestion, deleteQuestion };
