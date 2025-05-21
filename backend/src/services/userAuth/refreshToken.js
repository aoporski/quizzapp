const { verifyToken, generateAccessToken } = require('../../utils/tokens');
const db = require('../../db/postgres');
const User = db.User;

async function refreshAccessToken(refreshToken) {
  const decoded = verifyToken(refreshToken);

  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }

  const user = await User.findByPk(decoded.id);
  if (!user) throw new Error('User not found');

  const newAccessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return newAccessToken;
}

module.exports = { refreshAccessToken };
