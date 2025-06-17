const request = require('supertest');
const mongoose = require('mongoose');
const connectMongo = require('../../src/db/mongo');
const app = require('../../src/apptest');
const Tag = require('../../src/db/mongo/models/tag');

jest.setTimeout(5000);

let tagId;

beforeAll(async () => {
  await connectMongo();
  await Tag.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('tagController E2E', () => {
  const token = 'Bearer mocked-token';

  it('POST /tag – creates tag', async () => {
    const res = await request(app)
      .post('/tag')
      .set('Authorization', token)
      .send({ name: 'Test Tag' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Tag');
    tagId = res.body._id;
  });

  it('GET /tag – gets all tags', async () => {
    const res = await request(app).get('/tag').set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('DELETE /tag/:id – deletes tag', async () => {
    const res = await request(app).delete(`/tag/${tagId}`).set('Authorization', token);
    expect(res.statusCode).toBe(204);
  });
});
