const db = require('../../db/postgres');
const User = db.User;
const UserProfile = require('../../db/mongo/models/userProfile');

async function updateProfile(userId, data) {
  try {
    const { avatar, bio, privacy } = data;

    const updated = await UserProfile.findOneAndUpdate(
      { userId },
      { avatar, bio, privacy },
      { new: true, upsert: true }
    );

    return updated;
  } catch (err) {
    console.error('Error in updateProfile:', err.message);
    throw new Error('Could not update profile');
  }
}

async function deleteProfile(userId) {
  try {
    const result = await UserProfile.deleteOne({ userId });
    return result;
  } catch (err) {
    console.error('Error in deleteProfile:', err.message);
    throw new Error('Could not delete profile');
  }
}

async function completeProfile(userId, data) {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const { username, name, surname, country } = data;
    Object.assign(user, { username, name, surname, country });
    await user.save();
  } catch (err) {
    console.error('Error in completeProfile:', err.message);
    throw new Error('Could not complete profile');
  }
}

async function getProfile(userId) {
  try {
    const profile = await UserProfile.findOne({ userId });
    if (!profile) throw new Error('Profile not found');

    const result = {
      avatar: profile.avatar,
      bio: profile.bio,
    };

    if (profile.privacy?.showStats) result.stats = profile.stats;

    return result;
  } catch (err) {
    console.error('Error in getProfile:', err.message);
    throw new Error('Could not fetch profile');
  }
}

module.exports = {
  updateProfile,
  deleteProfile,
  completeProfile,
  getProfile,
};
