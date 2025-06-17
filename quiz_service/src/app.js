require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
const verifyAccessToken = require('./middlewares/verifyKeycloakToken');

const quizzRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tagRoutes = require('./routes/tagRoutes');

app.use('/quiz', verifyAccessToken, quizzRoutes);
app.use('/question', verifyAccessToken, questionRoutes);
app.use('/category', verifyAccessToken, categoryRoutes);
app.use('/tag', verifyAccessToken, tagRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
