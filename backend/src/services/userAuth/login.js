const db = require('../../db/postgres');
const User = db.User;
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokens');

async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const token = generateAccessToken({ id: user.id, role: user.role });
  return { user, token };
}

module.exports = { login };
