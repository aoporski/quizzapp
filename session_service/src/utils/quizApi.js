const axios = require('axios');

async function getQuestionMeta(questionId, token) {
  const res = await axios.get(`http://gateway:3001/api/quiz/question/${questionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

async function getAuthorIdMeta(creatorId, token) {
  try {
    const res = await axios.get(`http://gateway:3001/api/quiz/quiz/author/${creatorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error(`❌ Failed to fetch quizzes for author ${creatorId}:`, err.message);
    throw new Error('Unable to fetch quizzes for this author.');
  }
}

module.exports = { getQuestionMeta, getAuthorIdMeta };
