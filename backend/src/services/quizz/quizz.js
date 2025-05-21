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

  await quizz.save();
  return quizz;
}

async function editQuizz(id, title, description, difficulty, duration, isPrivate, isPublished) {
  const updated = await Quizz.findByIdAndUpdate(
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

  return updated;
}

async function deleteQuizz(id) {
  const deleted = await Quizz.findByIdAndDelete(id);
  return deleted;
}

module.exports = { createQuizz, editQuizz, deleteQuizz };
