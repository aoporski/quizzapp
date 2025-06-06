const userService = require('../services/userProfile');
const db = require('../db/postgres');
const User = db.User;
const UserProfile = require('../db/mongo/models/userProfile');

const updateProfile = async (req, res) => {
  try {
    const updated = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error while updating profile:', err.message);
    res.status(500).json({ message: 'Couldn’t update profile' });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const result = await userService.deleteProfile(req.user.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Profile doesn’t exist' });
    }
    res.status(200).json({ message: 'Profile deleted.' });
  } catch (err) {
    console.error('Error deleting profile:', err.message);
    res.status(500).json({ message: 'Couldn’t delete profile' });
  }
};

const completeProfile = async (req, res) => {
  try {
    await userService.completeProfile(req.user.id, req.body);
    res.status(200).json({ message: 'Profile completed!' });
  } catch (err) {
    console.error('Error completing profile:', err.message);
    res.status(400).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    res.status(200).json(profile);
  } catch (err) {
    console.error('Error getting profile:', err.message);
    res.status(400).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const sub = req.user.keycloakId;
    const user = await User.findOne({ where: { sub } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = await userService.getProfile(user.id);
    return res.json({ user, profile });
  } catch (err) {
    console.error('getMe error:', err.message);
    res.status(500).json({ message: 'Could not fetch profile' });
  }
};

const updateMe = async (req, res) => {
  try {
    const keycloakId = req.user.keycloakId;
    const result = await userService.updateMe(keycloakId, req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error('updateMe error:', err.message);
    res.status(500).json({ message: 'Could not update profile' });
  }
};

const syncUser = async (req, res) => {
  const tokenContent = req.user;

  const sub = tokenContent.keycloakId;
  const email = tokenContent.email;
  const preferred_username = tokenContent.preferred_username || '';
  const firstName = tokenContent.given_name || '';
  const lastName = tokenContent.family_name || '';

  try {
    let user = await User.findOne({ where: { sub } });

    if (!user) {
      user = await User.create({
        sub,
        email,
        preferred_username,
        firstName,
        lastName,
        isverified: true,
      });

      await UserProfile.create({ userId: user.id });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('User sync error:', err);
    return res.status(500).json({ message: 'User sync failed' });
  }
};

module.exports = {
  updateProfile,
  deleteProfile,
  completeProfile,
  getProfile,
  getMe,
  updateMe,
  syncUser,
};
