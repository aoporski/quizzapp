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

const sessionRoutes = require('./routes/sessionRoutes');

app.use('/', mockVerifyKeycloakToken, sessionRoutes);

module.exports = app;
