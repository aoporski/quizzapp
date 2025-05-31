const profileService = require('../services/userProfile');

const updateProfile = async (req, res) => {
  try {
    const updated = await profileService.updateProfile(req.user.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error while updating profile:', err.message);
    res.status(500).json({ message: 'Couldn’t update profile' });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const result = await profileService.deleteProfile(req.user.id);
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
    await profileService.completeProfile(req.user.id, req.body);
    res.status(200).json({ message: 'Profile completed!' });
  } catch (err) {
    console.error('Error completing profile:', err.message);
    res.status(400).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    await profileService.getProfile(req.user.id);
    res.status(200).json({ message: 'Got profile info' });
  } catch (err) {
    console.error('Error getting profile:', err.message);
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  updateProfile,
  deleteProfile,
  completeProfile,
  getProfile,
};
