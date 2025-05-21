const bcrypt = require('bcrypt');
const db = require('../../db/postgres');
const User = db.User;
const { sendResetPasswordEmail } = require('../../utils/sendMail');
const { generateAccessToken, verifyToken } = require('../../utils/tokens');

async function requestPasswordReset(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) return;

  const token = generateAccessToken({ id: user.id, role: user.role });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await sendResetPasswordEmail(email, resetLink);
}

async function resetPassword(token, newPassword) {
  const decoded = verifyToken(token);
  const user = await User.findByPk(decoded.id);
  if (!user) throw new Error('User not found');

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
}

module.exports = {
  requestPasswordReset,
  resetPassword,
};
