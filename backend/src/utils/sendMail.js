const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

//TODO:
const sendVerificationEmail = async (email, code) => {
  try {
    const mailOptions = {
      from: `"Quizz App" <project.thousand.123@gmail.com>`,
      replyTo: 'project.thousand.123@gmail.com',
      to: email,
      subject: 'Account verification',
      text: `Your verification code: ${code}`,
      html: `<p>Your verification code: <strong>${code}</strong></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email wysłany do ${email}: ${info.response}`);
  } catch (error) {
    console.error('Błąd wysyłania e-maila:', error);
  }
};

const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const mailOptions = {
      from: `"Quizz App"" <project.thousand.123@gmail.com>`,
      replyTo: 'project.thousand.123@gmail.com',
      to: email,
      subject: 'Password reset',
      text: `Use the following link to reset your password: ${resetLink}`,
      html: `<p>Use the following <strong>link or code</strong> to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${email}: ${info.response}`);
  } catch (error) {
    console.error('Błąd wysyłania e-maila resetującego hasło:', error);
  }
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
