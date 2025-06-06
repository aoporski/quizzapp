const db = require('../db/postgres');
const User = db.User;
const UserProfile = require('../db/mongo/models/userProfile');

async function updateProfile(userId, data) {
  try {
    const { avatar, bio, privacy } = data;
    const updateFields = {};
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (bio !== undefined) updateFields.bio = bio;
    if (privacy !== undefined) updateFields.privacy = privacy;

    const updated = await UserProfile.findOneAndUpdate({ userId }, updateFields, {
      new: true,
      upsert: true,
    });
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

    const { preferred_username, firstName, lastName, country } = data;

    Object.assign(user, { preferred_username, firstName, lastName, country });
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
      privacy: profile.privacy,
      stats: profile.privacy?.showStats ? profile.stats : undefined,
    };

    return result;
  } catch (err) {
    console.error('Error in getProfile:', err.message);
    throw new Error('Could not fetch profile');
  }
}

async function getMe(sub) {
  console.log('almost got me');
  const user = await User.findOne({ where: { sub } });
  if (!user) throw new Error('User not found');

  const profile = await UserProfile.findOne({ userId: user.id });

  return {
    user,
    profile: profile || null,
  };
}

async function updateMe(sub, data) {
  try {
    const user = await User.findOne({ where: { sub } });
    if (!user) throw new Error('User not found');

    const { preferred_username, firstName, lastName, country, avatar, bio, privacy } = data;

    if (preferred_username !== undefined) user.preferred_username = preferred_username;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (country !== undefined) user.country = country;

    await user.save();

    const updatedProfile = await updateProfile(user.id, { avatar, bio, privacy });

    return {
      user,
      profile: updatedProfile,
    };
  } catch (err) {
    console.error('Error in updateMe:', err.message);
    throw new Error('Could not update user data');
  }
}

module.exports = {
  updateProfile,
  deleteProfile,
  completeProfile,
  getProfile,
  getMe,
  updateMe,
};
