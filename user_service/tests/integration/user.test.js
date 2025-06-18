const request = require('supertest');
const { sequelize } = require('../../src/db/postgres');
const { User } = require('../../src/db/postgres');
const UserProfile = require('../../src/db/mongo/models/userProfile');
const connectMongo = require('../../src/db/connectMongoTest');
const mongoose = require('mongoose');

jest.setTimeout(3000);
jest.mock('../../src/services/keycloakUser', () => ({
  updateKeycloakUser: jest.fn(() => ({
    id: 'abc-123',
    preferred_username: 'newname',
    firstName: 'Nowy',
  })),
}));
jest.mock('../../src/services/userProfile', () => {
  const originalModule = jest.requireActual('../../src/services/userProfile');
  return {
    ...originalModule,
    getProfile: jest.fn(() => ({
      user: {
        email: 'test@example.com',
        preferred_username: 'mocked',
        firstName: 'Mocked',
        lastName: 'User',
      },
      profile: {
        bio: '',
        publicStats: true,
        stats: [],
        history: [],
      },
    })),
    updateUserInKeycloak: jest.fn(() => ({
      id: 'abc-123',
      preferred_username: 'newname',
      firstName: 'Nowy',
    })),

    getUserById: jest.fn(() => ({
      id: 'abc-123',
      userId: 'some-user-id',
      bio: '',
      publicStats: true,
    })),
  };
});

const app = require('../../src/apptest');

beforeAll(async () => {
  console.log('🔌 Connecting to Mongo...');
  await connectMongo();
  console.log('✅ Connected to Mongo');

  console.log('🐘 Syncing Sequelize...');
  await sequelize.sync({ force: true });
  console.log('✅ Synced Sequelize');
  console.log('🔁 Syncing user...');
  const res = await request(app).post('/sync').set('Authorization', 'Bearer mocked-token');

  console.log('🔁 /sync response:', res.statusCode, res.body);
  console.log('✅ User synced');
}, 30000);

afterAll(async () => {
  await mongoose.connection.close();
  await sequelize.close();
});

describe('userProfileController E2E – minimal version', () => {
  it('POST /sync – creates user and profile if not exists', async () => {
    const existing = await User.findOne({ where: { sub: 'abc-123' } });
    expect(existing).not.toBeNull();

    const profile = await UserProfile.findOne({ userId: existing.id });
    expect(profile).not.toBeNull();
  });

  it('GET /me – returns user and profile', async () => {
    const res = await request(app).get('/me').set('Authorization', 'Bearer mocked-token');

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
    expect(res.body.profile).toBeDefined();
  });

  it('GET /:id – returns user profile by id', async () => {
    const user = await User.findOne({ where: { sub: 'abc-123' } });

    const res = await request(app).get(`/${user.id}`).set('Authorization', 'Bearer mocked-token');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('bio');
  });

  it('PUT /update-me – updates user basic info', async () => {
    const res = await request(app)
      .put('/update-me')
      .set('Authorization', 'Bearer mocked-token')
      .send({ preferred_username: 'newname', firstName: 'Nowy' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.preferred_username).toBe('newname');

    const updated = await User.findOne({ where: { sub: 'abc-123' } });
    expect(updated.firstName).toBe('Nowy');
  });
});
