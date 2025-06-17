const axios = require('axios');

async function getQuestionMeta(questionId, token) {
  const res = await axios.get(`http://gateway:3001/api/quiz/question/${questionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

module.exports = { getQuestionMeta };
