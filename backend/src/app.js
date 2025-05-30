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

const authRoutes = require('../src/routes/authRoutes');
const userRoutes = require('../src/routes/userRoutes');
const quizzRoutes = require('../src/routes/quizzRoutes');
const questionRoutes = require('../src/routes/questionRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/quizz', quizzRoutes);
app.use('/api/question', questionRoutes);

require('../src/utils/deleteUnverified');

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
