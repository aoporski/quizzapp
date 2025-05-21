const db = require('../../db/postgres');
const User = db.User;
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokens');
const redis = require('../../config/redis');
const { sendVerificationEmail } = require('../../utils/sendMail');

async function register({ email, password, username, name, surname, country }) {
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing && existing.isverified) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      name,
      surname,
      country,
      isverified: false,
    });

    const payload = { id: newUser.id, email: newUser.email, role: newUser.role || 'user' };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(`verify:${email}`, code, 'EX', 900);

    await sendVerificationEmail(email, code);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        name: newUser.name,
        surname: newUser.surname,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error('Error during signup', error.message);
    throw error;
  }
}

async function verify(email, code) {
  try {
    const expectedCode = await redis.get(`verify:${email}`);
    if (!expectedCode) throw new Error('Verification code expired');

    if (code !== expectedCode) throw new Error('Incorrect code');

    const user = await User.findOne({ where: { email } });
    if (!user || user.isverified) throw new Error('Invalid user');

    user.isverified = true;
    await user.save();

    await redis.del(`verify:${email}`);

    return { message: 'Email verified successfully' };
  } catch (error) {
    console.error('Error during signup', error.message);
    throw error;
  }
}

module.exports = { register, verify };
