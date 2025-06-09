const Quizz = require('../db/mongo/models/quizz');

async function createQuizz(
  title,
  description,
  difficulty,
  duration,
  isPrivate,
  isPublished,
  authorId,
  category
) {
  const quizz = new Quizz({
    title,
    description,
    difficulty,
    duration,
    isPrivate,
    isPublished,
    authorId,
    category,
  });

  try {
    await quizz.save();
    return quizz;
  } catch (err) {
    console.error('Error adding quizz', err.message);
    throw err;
  }
}

async function editQuizz(
  id,
  title,
  description,
  difficulty,
  duration,
  isPrivate,
  isPublished,
  category,
  authorId
) {
  try {
    const quiz = await Quizz.findById(id);
    if (!quiz) throw new Error('Quiz not found');
    if (quiz.authorId !== authorId) throw new Error('Unauthorized');

    const edited = await Quizz.findByIdAndUpdate(
      id,
      {
        title,
        description,
        difficulty,
        duration,
        isPrivate,
        isPublished,
        category,
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

async function deleteQuizz(id, authorId) {
  try {
    const quiz = await Quizz.findById(id);
    if (!quiz) throw new Error('Quiz not found');
    if (quiz.authorId !== authorId) throw new Error('Unauthorized');

    const deleted = await Quizz.findByIdAndDelete(id);
    return deleted;
  } catch (err) {
    console.error('Error deleting quizz', err.message);
    throw err;
  }
}

async function searchQuizes(
  category,
  difficulty,
  language,
  keyword,
  sortBy = 'createdAt',
  order = 'desc',
  page = '1',
  limit = '10'
) {
  const filters = {
    isPrivate: false,
    isPublished: true,
  };

  if (category) filters.category = category;
  if (difficulty) filters.difficulty = difficulty;
  if (language) filters.language = language;
  if (keyword) {
    const regex = new RegExp(keyword, 'i');
    filters.$or = [
      { title: regex },
      { description: regex },
      { keywords: { $in: [keyword.toLowerCase()] } },
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = order === 'asc' ? 1 : -1;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  try {
    const quizzes = await Quizz.find(filters).sort(sortOptions).skip(skip).limit(limitNum);
    const total = await Quizz.countDocuments(filters);

    return {
      quizzes,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    };
  } catch (err) {
    console.error('Error searching quizzes:', err.message);
    throw err;
  }
}
async function getQuizzById(id) {
  try {
    return await Quizz.findById(id);
  } catch (err) {
    console.error('Error in getQuizzById:', err.message);
    throw err;
  }
}

module.exports = { createQuizz, editQuizz, deleteQuizz, searchQuizes, getQuizzById };
