const Quizz = require('../db/mongo/models/quizz');
const Category = require('../db/mongo/models/category');

async function getAllSubcategoryIds(rootId) {
  const result = [rootId];

  async function collectChildren(id) {
    const children = await Category.find({ parentCategory: id });
    for (const child of children) {
      result.push(child._id);
      await collectChildren(child._id);
    }
  }

  await collectChildren(rootId);
  return result;
}

async function createQuizz(
  title,
  description,
  difficulty,
  duration,
  isPrivate,
  isPublished,
  authorId,
  categories,
  tags
) {
  const quizz = new Quizz({
    title,
    description,
    difficulty,
    duration,
    isPrivate,
    isPublished,
    authorId,
    categories,
    tags,
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
  categories,
  tags,
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
        categories,
        tags,
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
  tags,
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

  if (category) {
    const allCategoryIds = await getAllSubcategoryIds(category);
    filters.categories = { $in: allCategoryIds };
  }

  if (tags) {
    filters.tags = { $all: tags.split(',') };
  }

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
    const quizzes = await Quizz.find(filters)
      .populate('categories')
      .populate('tags')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

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
    return await Quizz.findById(id).populate('categories').populate('tags');
  } catch (err) {
    console.error('Error in getQuizzById:', err.message);
    throw err;
  }
}

module.exports = {
  createQuizz,
  editQuizz,
  deleteQuizz,
  searchQuizes,
  getQuizzById,
};
