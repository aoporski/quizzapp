require('dotenv').config();
const mongoose = require('mongoose');

async function connectMongoTest() {
  try {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    console.log('✅ Połączono z MongoDBTest!');
  } catch (err) {
    console.error('❌ Błąd połączenia z MongoDBTest:', err.message);
    process.exit(1);
  }
}

module.exports = connectMongoTest;
