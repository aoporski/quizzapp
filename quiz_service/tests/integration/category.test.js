const request = require('supertest');
const mongoose = require('mongoose');
const connectMongo = require('../../src/db/mongo');
const app = require('../../src/apptest');
const Category = require('../../src/db/mongo/models/category');

jest.setTimeout(5000);

let categoryId;

beforeAll(async () => {
  await connectMongo();
  await Category.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('categoryController E2E', () => {
  const token = 'Bearer mocked-token';

  it('POST /category – creates category', async () => {
    const res = await request(app)
      .post('/category')
      .set('Authorization', token)
      .send({ name: 'Test Category' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Category');
    categoryId = res.body._id;
  });

  it('GET /category – gets all categories', async () => {
    const res = await request(app).get('/category').set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /category/:id – gets category by ID', async () => {
    const res = await request(app).get(`/category/${categoryId}`).set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(categoryId);
  });

  it('PUT /category/:id – updates category', async () => {
    const res = await request(app)
      .put(`/category/${categoryId}`)
      .set('Authorization', token)
      .send({ name: 'Updated Category' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Category');
  });

  it('DELETE /category/:id – deletes category', async () => {
    const res = await request(app).delete(`/category/${categoryId}`).set('Authorization', token);
    expect(res.statusCode).toBe(204);
  });
});
