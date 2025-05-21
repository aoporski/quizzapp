const cron = require('node-cron');
const { Op } = require('sequelize');
const db = require('../db/postgres');
const User = db.User;

cron.schedule('*/1 * * * *', async () => {
  const expiredUsers = await User.findAll({
    where: {
      isverified: false,
      createdAt: { [Op.lt]: new Date(Date.now() - 15 * 60 * 1000) },
    },
  });

  for (const user of expiredUsers) {
    await user.destroy();
    console.log(`Deleted unverified user: ${user.email}`);
  }
});
