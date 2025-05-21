const Quizz = require('../../db/mongo/models/quizz');

async function createQuizz(
  title,
  description,
  difficulty,
  duration,
  isPrivate,
  isPublished,
  authorId
) {
  const quizz = new Quizz({
    title,
    description,
    difficulty,
    duration,
    isPrivate,
    isPublished,
    authorId,
  });
  try {
    await quizz.save();
    return quizz;
  } catch (err) {
    console.error('Error adding quizz', err.message);
    throw err;
  }
}

async function editQuizz(id, title, description, difficulty, duration, isPrivate, isPublished) {
  try {
    const edited = await Quizz.findByIdAndUpdate(
      id,
      {
        title,
        description,
        difficulty,
        duration,
        isPrivate,
        isPublished,
        updatedAt: new Date(),
      },
      { new: true }
    );
    return edited;
  } catch (err) {
    console.error('Error editing quizz', err.message);
    throw err;
  }
}

async function deleteQuizz(id) {
  try {
    const deleted = await Quizz.findByIdAndDelete(id);
    return deleted;
  } catch (err) {
    console.error('Error deleting quizz', err.message);
    throw err;
  }
}

module.exports = { createQuizz, editQuizz, deleteQuizz };
