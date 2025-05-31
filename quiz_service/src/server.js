require('dotenv').config();
const app = require('./app');
const connectMongo = require('./db/mongo/index');
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectMongo();
    console.log('Connected with MongoDB');

    app.listen(PORT, () => {
      console.log(`Server working on:  http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1);
  }
})();
