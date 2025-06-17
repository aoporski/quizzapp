const request = require('supertest');
const mongoose = require('mongoose');
const connectMongo = require('../../src/db/mongo');
const Session = require('../../src/db/mongo/models/Session');
const Quiz = require('../../src/db/mongo/models/Quiz');
const Question = require('../../src/db/mongo/models/Question');
const Redis = require('ioredis');
const { getQuestionMeta } = require('../../src/utils/quizApi');

jest.setTimeout(10000);
jest.mock('../../src/utils/quizApi', () => ({
  getQuestionMeta: jest.fn((id, token) =>
    Promise.resolve({
      _id: id,
      correctAnswers: ['4'],
      points: 2,
    })
  ),
}));
const app = require('../../src/apptest');

const redis = new Redis({ host: 'quizzapp-redis', port: 6379 });

let quizId;
let questionId;
const token = 'Bearer mocked-token';

beforeAll(async () => {
  await connectMongo();
  await mongoose.connection.dropDatabase();
  await redis.flushall();

  const quiz = await Quiz.create({
    title: 'Test Quiz',
    description: 'Test',
    difficulty: 'easy',
    duration: 30,
    isPrivate: false,
    isPublished: true,
    authorId: 'abc-123',
  });
  quizId = quiz._id;

  const question = await Question.create({
    quizId,
    type: 'single-choice',
    text: '2+2?',
    options: ['3', '4'],
    correctAnswers: ['4'],
    points: 2,
  });
  questionId = question._id;
});

afterAll(async () => {
  await mongoose.connection.close();
  await redis.quit();
});

describe('quizSessionController E2E', () => {
  it('POST /start/:quizId – starts session', async () => {
    const res = await request(app).post(`/start/${quizId}`).set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.quizId).toBe(String(quizId));
  });

  it('POST /:quizId/answer – saves answer', async () => {
    const res = await request(app)
      .post(`/${quizId}/answer`)
      .set('Authorization', token)
      .send({ questionId, response: '4' });

    expect(res.statusCode).toBe(200);
    expect(res.body.answers.length).toBe(1);
  });

  it('POST /:quizId/pause – pauses session', async () => {
    const res = await request(app).post(`/${quizId}/pause`).set('Authorization', token);
    expect(res.statusCode).toBe(204);
  });

  it('POST /:quizId/resume – resumes session', async () => {
    const res = await request(app).post(`/${quizId}/resume`).set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('in_progress');
  });

  it('POST /:quizId/complete – completes session', async () => {
    const res = await request(app).post(`/${quizId}/complete`).set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.score).toBe(2);
    expect(res.body.percentage).toBe(100);
  });

  it('GET /history – gets session history', async () => {
    const res = await request(app).get('/history').set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].score).toBe(2);
  });

  it('GET /stats – gets user stats', async () => {
    const res = await request(app).get('/stats').set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.totalQuizzes).toBe(1);
    expect(res.body.bestScore).toBe(100);
    expect(res.body.averageScore).toBe(100);
  });

  it('GET /trend – returns user performance trend', async () => {
    const quiz2 = await Quiz.create({
      title: 'Second Quiz',
      description: 'Test 2',
      difficulty: 'medium',
      duration: 20,
      isPrivate: false,
      isPublished: true,
      authorId: 'abc-123',
    });

    const question2 = await Question.create({
      quizId: quiz2._id,
      type: 'single-choice',
      text: '3+3?',
      options: ['5', '6'],
      correctAnswers: ['6'],
      points: 2,
    });

    await request(app).post(`/start/${quiz2._id}`).set('Authorization', token);
    await request(app)
      .post(`/${quiz2._id}/answer`)
      .set('Authorization', token)
      .send({ questionId: question2._id, response: '5' }); // zła odpowiedź
    await request(app).post(`/${quiz2._id}/complete`).set('Authorization', token);

    const res = await request(app).get('/stats/trend').set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    const trend = res.body;

    const percentages = trend.map((e) => e.percentage);
    expect(percentages).toContain(0);
    expect(percentages).toContain(100);

    const dates = trend.map((e) => new Date(e.completedAt).getTime());
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
    }
  });
});
