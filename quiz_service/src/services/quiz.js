const Quizz = require('../db/mongo/models/quizz');

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

module.exports = { createQuizz, editQuizz, deleteQuizz, searchQuizes };
