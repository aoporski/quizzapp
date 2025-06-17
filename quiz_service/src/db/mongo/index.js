require('dotenv').config();
const mongoose = require('mongoose');

async function connectMongo() {
  require('./models/tag');
  require('./models/category');
  require('./models/quizz');
  require('./models/question');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Połączono z MongoDB!');
  } catch (err) {
    console.error('❌ Błąd połączenia z MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectMongo;
