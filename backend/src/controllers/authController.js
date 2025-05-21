const loginService = require('../services/userAuth/login');
const registerService = require('../services/userAuth/register');
const oauthService = require('../services/userAuth/oauth');
const resetPasswordService = require('../services/userAuth/resetPassword');
const refreshTokenService = require('../services/userAuth/refreshToken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing login or password' });
    }
    const result = await loginService.login(email, password);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error logging in:', err.message);
    res.status(500).json({ message: 'Login failed' });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, username, name, surname, country } = req.body;

    if (!email || !password || !username || !name || !surname || !country) {
      return res.status(400).json({ message: 'Missing required registration fields' });
    }

    const result = await registerService.register({
      email,
      password,
      username,
      name,
      surname,
      country,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(400).json({ message: err.message || 'Registration failed' });
  }
};

const verify = async (req, res) => {
  try {
    const { email, code } = req.body;
    const result = await registerService.verify(email, code);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error verifying', err.message);
    res.status(400).json({ message: err.message || 'Verification failed' });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  await resetPasswordService.requestPasswordReset(email);
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  await resetPasswordService.resetPassword(token, newPassword);
};

const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const refreshToken = authHeader.split(' ')[1];
    const newAccessToken = await refreshTokenService.refreshAccessToken(refreshToken);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh token error:', err.message);
    res.status(403).json({ message: err.message || 'Token refresh failed' });
  }
};

module.exports = { login, register, verify, requestPasswordReset, resetPassword, refreshToken };
