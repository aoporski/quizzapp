const request = require('supertest');
const mongoose = require('mongoose');
const connectMongo = require('../../src/db/mongo');
const Quiz = require('../../src/db/mongo/models/quizz');
const app = require('../../src/apptest');

jest.setTimeout(5000);

beforeAll(async () => {
  await connectMongo();
  await Quiz.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('quizController E2E', () => {
  let createdQuizId;
  const token = 'Bearer mocked-token';

  it('POST /quiz – creates a quiz', async () => {
    const res = await request(app).post('/quiz').set('Authorization', token).send({
      title: 'Test Quiz',
      description: 'Test description',
      difficulty: 'easy',
      duration: 60,
      isPrivate: false,
      isPublished: true,
      categories: [],
      tags: [],
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Quiz');
    createdQuizId = res.body._id;
  });

  it('GET /quiz/me – returns my quizzes', async () => {
    const res = await request(app).get('/quiz/me').set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /quiz/:id – returns quiz by ID', async () => {
    const res = await request(app).get(`/quiz/${createdQuizId}`).set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdQuizId);
  });

  it('PATCH /quiz/:id – updates quiz', async () => {
    const res = await request(app)
      .patch(`/quiz/${createdQuizId}`)
      .set('Authorization', token)
      .send({ title: 'Updated Quiz' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Quiz');
  });

  it('DELETE /quiz/:id – deletes quiz', async () => {
    const res = await request(app).delete(`/quiz/${createdQuizId}`).set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe('object');
  });
});
