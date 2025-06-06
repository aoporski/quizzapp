// const cron = require('node-cron');
// const { Op } = require('sequelize');
// const db = require('../db/postgres');
// const User = db.User;

// const axios = require('axios');

// const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_BASE_URL || 'http://keycloak:8080';
// const REALM = process.env.KEYCLOAK_REALM || 'quizzapp';
// const ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN || 'admin';
// const ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'secret';
// const CLIENT_ID = 'admin-cli';

// async function getAdminToken() {
//   const res = await axios.post(
//     `${KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`,
//     new URLSearchParams({
//       username: ADMIN_USERNAME,
//       password: ADMIN_PASSWORD,
//       grant_type: 'password',
//       client_id: CLIENT_ID,
//     }),
//     {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     }
//   );

//   return res.data.access_token;
// }

// async function deleteKeycloakUser(userId, token) {
//   await axios.delete(`${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/users/${userId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// }

// async function runCleanup() {
//   try {
//     const token = await getAdminToken();
//     const thresholdDate = new Date(Date.now() - 15 * 60 * 1000);
//     console.log('🕒 Looking for unverified users before:', thresholdDate.toISOString());

//     const expiredUsers = await User.findAll({
//       where: {
//         isVerified: false,
//         createdAt: { [Op.lt]: thresholdDate },
//       },
//     });

//     for (const user of expiredUsers) {
//       if (!user.createdAt || isNaN(new Date(user.createdAt))) {
//         console.warn(`⚠️ Skipping user with invalid createdAt: ${user.email} (${user.createdAt})`);
//         continue;
//       }

//       try {
//         if (user.keycloakId) {
//           await deleteKeycloakUser(user.keycloakId, token);
//           console.log(`✅ Deleted from Keycloak: ${user.keycloakId}`);
//         }
//         await user.destroy();
//         console.log(`🗑️ Deleted from DB: ${user.email}`);
//       } catch (err) {
//         console.error(`❌ Failed to delete user ${user.email}:`, err.message);
//       }
//     }
//   } catch (err) {
//     console.error('❌ Cron job failed:', err.message);
//   }
// }

// // Cron co minutę, z ustawioną strefą czasową
// cron.schedule(
//   '*/1 * * * *',
//   () => {
//     runCleanup();
//   },
//   {
//     scheduled: true,
//     timezone: 'UTC', // lub 'Europe/Warsaw'
//   }
// );
