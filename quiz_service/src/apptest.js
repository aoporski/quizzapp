const express = require('express');
const app = express();

app.use(express.json());

const mockUser = {
  keycloakId: 'abc-123',
  email: 'test@example.com',
  preferred_username: 'testuser',
  given_name: 'Test',
  family_name: 'User',
  roles: ['user'],
};

const mockVerifyKeycloakToken = (req, res, next) => {
  req.user = mockUser;
  next();
};

const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tagRoutes = require('./routes/tagRoutes');

app.use('/quiz', mockVerifyKeycloakToken, quizRoutes);
app.use('/question', mockVerifyKeycloakToken, questionRoutes);
app.use('/category', mockVerifyKeycloakToken, categoryRoutes);
app.use('/tag', mockVerifyKeycloakToken, tagRoutes);

module.exports = app;
