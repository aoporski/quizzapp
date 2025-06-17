module.exports = (req, res, next) => {
  console.log('✅ MOCK verifyKeycloakToken działa');

  req.user = {
    keycloakId: 'abc-123',
    email: 'test@example.com',
    preferred_username: 'testuser',
    given_name: 'Test',
    family_name: 'User',
    roles: ['user'],
  };
  next();
};
