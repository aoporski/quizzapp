const Question = require('../db/mongo/models/question');
const Quizz = require('../db/mongo/models/quizz');

async function addQuestion(quizId, type, text, options, correctAnswers, points, hint, authorId) {
  try {
    const quiz = await Quizz.findById(quizId);
    if (!quiz) throw new Error('Quiz not found');
    if (quiz.authorId !== authorId) throw new Error('Unauthorized');

    const question = new Question({ quizId, type, text, options, correctAnswers, points, hint });
    await question.save();
    return question;
  } catch (err) {
    console.error('Error adding question', err.message);
    throw err;
  }
}

async function editQuestion(id, type, text, options, correctAnswers, points, hint, authorId) {
  try {
    const question = await Question.findById(id);
    if (!question) throw new Error('Question not found');

    const quiz = await Quizz.findById(question.quizId);
    if (!quiz) throw new Error('Quiz not found');
    if (quiz.authorId !== authorId) throw new Error('Unauthorized');

    return await Question.findByIdAndUpdate(
      id,
      { type, text, options, correctAnswers, points, hint },
      { new: true }
    );
  } catch (err) {
    console.error('Error editing question', err.message);
    throw err;
  }
}

async function deleteQuestion(questionId, authorId) {
  try {
    const question = await Question.findById(questionId);
    if (!question) throw new Error('Question not found');

    const quiz = await Quizz.findById(question.quizId);
    if (!quiz) throw new Error('Quiz not found');
    if (quiz.authorId !== authorId) throw new Error('Unauthorized');

    return await Question.findByIdAndDelete(questionId);
  } catch (err) {
    console.error('Error deleting question', err.message);
    throw err;
  }
}

async function getQuestionById(id) {
  try {
    return await Question.findById(id);
  } catch (err) {
    console.error('Error getting question by ID:', err.message);
    throw err;
  }
}

async function getQuestionsForQuiz(quizId) {
  try {
    return await Question.find({ quizId });
  } catch (err) {
    console.error('Error getting questions for quiz:', err.message);
    throw err;
  }
}

module.exports = {
  addQuestion,
  editQuestion,
  deleteQuestion,
  getQuestionById,
  getQuestionsForQuiz,
};
