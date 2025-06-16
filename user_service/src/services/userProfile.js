const db = require('../db/postgres');
const User = db.User;
const UserProfile = require('../db/mongo/models/userProfile');
const { updateKeycloakUser } = require('./keycloakUser');
const axios = require('axios');

async function getUserById(userId) {
  try {
    const user = await User.findOne({
      where: { sub: userId },
      attributes: ['id', 'preferred_username', 'email', 'firstName', 'lastName'],
    });
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return user;
  } catch (err) {
    console.error('Error in getUserById:', err.message);
    throw err;
  }
}

async function updateProfile(userId, data) {
  try {
    const { bio, privacy } = data;
    const updateFields = {};
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

async function getUserHistoryFromSessionService(token) {
  try {
    const res = await axios.get(`http://gateway:3001/api/session/history`, {
      headers: {
        Authorization: token,
      },
    });

    return res.data;
  } catch (err) {
    console.error('Error fetching user history from session-service:', err.message);
    return [];
  }
}

async function getUserStatsFromSessionService(token) {
  try {
    const res = await axios.get(`http://gateway:3001/api/session/stats`, {
      headers: {
        Authorization: token,
      },
    });

    return res.data;
  } catch (err) {
    console.error('Error fetching user stats from session-service:', err.message);
    return [];
  }
}

async function completeProfile(userId, data) {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const { preferred_username, firstName, lastName } = data;
    Object.assign(user, { preferred_username, firstName, lastName });
    await user.save();
  } catch (err) {
    console.error('Error in completeProfile:', err.message);
    throw new Error('Could not complete profile');
  }
}

async function getProfile(userId, token = null) {
  try {
    const profile = await UserProfile.findOne({ userId });
    if (!profile) throw new Error('Profile not found');

    let stats = undefined;
    let history = undefined;

    if (profile.privacy?.showStats && token) {
      try {
        stats = await getUserStatsFromSessionService(token);
        history = await getUserHistoryFromSessionService(token);
      } catch (err) {
        console.warn('Could not fetch stats or history:', err.message);
      }
    }

    return {
      bio: profile.bio,
      privacy: profile.privacy,
      stats,
      history,
    };
  } catch (err) {
    console.error('Error in getProfile:', err.message);
    throw new Error('Could not fetch profile');
  }
}

async function getMe(sub, token) {
  const user = await User.findOne({ where: { sub } });
  if (!user) throw new Error('User not found');

  const profile = await getProfile(user.id, token);
  return {
    user,
    profile,
  };
}

async function updateMe(sub, data) {
  try {
    const user = await User.findOne({ where: { sub } });
    if (!user) throw new Error('User not found');

    const { preferred_username, firstName, lastName, bio, privacy } = data;

    if (preferred_username !== undefined) user.preferred_username = preferred_username;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;

    await user.save();

    const updatedProfile = await updateProfile(user.id, { bio, privacy });

    const keycloakPayload = {
      email: user.email,
    };
    if (preferred_username) keycloakPayload.username = preferred_username;
    if (firstName) keycloakPayload.firstName = firstName;
    if (lastName) keycloakPayload.lastName = lastName;

    await updateKeycloakUser(sub, keycloakPayload);
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
  getUserById,
};

// const db = require('../db/postgres');
// const User = db.User;
// const UserProfile = require('../db/mongo/models/userProfile');
// const { updateKeycloakUser } = require('./keycloakUser');

// async function getUserById(userId) {
//   try {
//     const user = await User.findOne({
//       where: { sub: userId },
//       attributes: ['id', 'preferred_username', 'email', 'firstName', 'lastName'],
//     });
//     if (!user) {
//       const error = new Error('User not found');
//       error.status = 404;
//       throw error;
//     }
//     return user;
//   } catch (err) {
//     console.error('Error in getUserById:', err.message);
//     throw err;
//   }
// }

// async function updateProfile(userId, data) {
//   try {
//     const { avatar, bio, privacy } = data;
//     const updateFields = {};
//     if (avatar !== undefined) updateFields.avatar = avatar;
//     if (bio !== undefined) updateFields.bio = bio;
//     if (privacy !== undefined) updateFields.privacy = privacy;

//     const updated = await UserProfile.findOneAndUpdate({ userId }, updateFields, {
//       new: true,
//       upsert: true,
//     });
//     return updated;
//   } catch (err) {
//     console.error('Error in updateProfile:', err.message);
//     throw new Error('Could not update profile');
//   }
// }

// async function deleteProfile(userId) {
//   try {
//     const result = await UserProfile.deleteOne({ userId });
//     return result;
//   } catch (err) {
//     console.error('Error in deleteProfile:', err.message);
//     throw new Error('Could not delete profile');
//   }
// }

// async function completeProfile(userId, data) {
//   try {
//     const user = await User.findByPk(userId);
//     if (!user) throw new Error('User not found');

//     const { preferred_username, firstName, lastName } = data;

//     Object.assign(user, { preferred_username, firstName, lastName });
//     await user.save();
//   } catch (err) {
//     console.error('Error in completeProfile:', err.message);
//     throw new Error('Could not complete profile');
//   }
// }

// async function getProfile(userId) {
//   try {
//     const profile = await UserProfile.findOne({ userId });
//     if (!profile) throw new Error('Profile not found');

//     const result = {
//       avatar: profile.avatar,
//       bio: profile.bio,
//       privacy: profile.privacy,
//       stats: profile.privacy?.showStats ? profile.stats : undefined,
//     };

//     return result;
//   } catch (err) {
//     console.error('Error in getProfile:', err.message);
//     throw new Error('Could not fetch profile');
//   }
// }

// async function getMe(sub) {
//   const user = await User.findOne({ where: { sub } });
//   if (!user) throw new Error('User not found');

//   const profile = await UserProfile.findOne({ userId: user.id });

//   return {
//     user,
//     profile: profile || null,
//   };
// }

// async function updateMe(sub, data) {
//   try {
//     const user = await User.findOne({ where: { sub } });
//     if (!user) throw new Error('User not found');

//     const { preferred_username, firstName, lastName, avatar, bio, privacy } = data;

//     if (preferred_username !== undefined) user.preferred_username = preferred_username;
//     if (firstName !== undefined) user.firstName = firstName;
//     if (lastName !== undefined) user.lastName = lastName;

//     await user.save();

//     const updatedProfile = await updateProfile(user.id, { avatar, bio, privacy });

//     const keycloakPayload = {
//       email: user.email,
//     };
//     if (preferred_username) keycloakPayload.username = preferred_username;
//     if (firstName) keycloakPayload.firstName = firstName;
//     if (lastName) keycloakPayload.lastName = lastName;

//     await updateKeycloakUser(sub, keycloakPayload);
//     return {
//       user,
//       profile: updatedProfile,
//     };
//   } catch (err) {
//     console.error('Error in updateMe:', err.message);
//     throw new Error('Could not update user data');
//   }
// }

// module.exports = {
//   updateProfile,
//   deleteProfile,
//   completeProfile,
//   getProfile,
//   getMe,
//   updateMe,
//   getUserById,
// };
