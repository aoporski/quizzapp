const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../../db/postgres');
const User = db.User;
const { generateAccessToken } = require('../../utils/tokens');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const [user] = await User.findOrCreate({
          where: { email: profile.emails[0].value },
          defaults: {
            fullname: profile.displayName,
            oauthProvider: 'google',
            oauthId: profile.id,
            emailVerified: true,
          },
        });

        const token = generateAccessToken({ id: user.id, role: user.role });
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((obj, done) => done(null, obj));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
