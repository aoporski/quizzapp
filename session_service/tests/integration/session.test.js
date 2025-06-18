const request = require('supertest');
const mongoose = require('mongoose');
const connectMongo = require('../../src/db/connectMongoTest');
const Session = require('../../src/db/mongo/models/Session');
const Quiz = require('../../src/db/mongo/models/Quiz');
const Question = require('../../src/db/mongo/models/Question');
const Redis = require('ioredis');

jest.setTimeout(10000);

jest.mock('../../src/utils/quizApi', () => {
  const mongoose = require('mongoose');
  const mockQuiz1Id = new mongoose.Types.ObjectId();
  const mockQuiz2Id = new mongoose.Types.ObjectId();

  return {
    getQuestionMeta: jest.fn((id, token) =>
      Promise.resolve({
        _id: id,
        correctAnswers: ['4'],
        points: 2,
      })
    ),
    getAuthorIdMeta: jest.fn(() =>
      Promise.resolve([
        {
          _id: mockQuiz1Id,
          title: 'Mock Quiz 1',
          description: 'Description 1',
          categories: [],
          tags: [],
          difficulty: 'easy',
          duration: 30,
          isPrivate: false,
          isPublished: true,
          authorId: 'abc-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: mockQuiz2Id,
          title: 'Mock Quiz 2',
          description: 'Description 2',
          categories: [],
          tags: [],
          difficulty: 'hard',
          duration: 45,
          isPrivate: false,
          isPublished: true,
          authorId: 'abc-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
    ),
    __mockQuiz1Id: mockQuiz1Id,
    __mockQuiz2Id: mockQuiz2Id,
  };
});

// ⬇️ Pobieramy ID z mocka
const { __mockQuiz1Id: quiz1Id, __mockQuiz2Id: quiz2Id } = require('../../src/utils/quizApi');

const app = require('../../src/apptest');
const redis = new Redis({ host: 'quizzapp-redis', port: 6379 });

let questionId;
const token = 'Bearer mocked-token';

beforeAll(async () => {
  await connectMongo();
  await mongoose.connection.dropDatabase();
  await redis.flushall();

  // ✅ Tworzymy quizy z tymi samymi ID co mock
  await Quiz.create({
    _id: quiz1Id,
    title: 'Test Quiz',
    description: 'Test',
    difficulty: 'easy',
    duration: 30,
    isPrivate: false,
    isPublished: true,
    authorId: 'abc-123',
  });

  await Quiz.create({
    _id: quiz2Id,
    title: 'Second Quiz',
    description: 'Test 2',
    difficulty: 'medium',
    duration: 20,
    isPrivate: false,
    isPublished: true,
    authorId: 'abc-123',
  });

  const question = await Question.create({
    quizId: quiz1Id,
    type: 'single-choice',
    text: '2+2?',
    options: ['3', '4'],
    correctAnswers: ['4'],
    points: 2,
  });

  await Question.create({
    quizId: quiz2Id,
    type: 'single-choice',
    text: '3+3?',
    options: ['5', '6'],
    correctAnswers: ['6'],
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
    const res = await request(app).post(`/start/${quiz1Id}`).set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.quizId).toBe(String(quiz1Id));
  });

  it('POST /:quizId/answer – saves answer', async () => {
    const res = await request(app)
      .post(`/${quiz1Id}/answer`)
      .set('Authorization', token)
      .send({ questionId, response: '4' });

    expect(res.statusCode).toBe(200);
    expect(res.body.answers.length).toBe(1);
  });

  it('POST /:quizId/pause – pauses session', async () => {
    const res = await request(app).post(`/${quiz1Id}/pause`).set('Authorization', token);
    expect(res.statusCode).toBe(204);
  });

  it('POST /:quizId/resume – resumes session', async () => {
    const res = await request(app).post(`/${quiz1Id}/resume`).set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('in_progress');
  });

  it('POST /:quizId/complete – completes session', async () => {
    const res = await request(app).post(`/${quiz1Id}/complete`).set('Authorization', token);
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
    const question2 = await Question.findOne({ quizId: quiz2Id });

    await request(app).post(`/start/${quiz2Id}`).set('Authorization', token);
    await request(app)
      .post(`/${quiz2Id}/answer`)
      .set('Authorization', token)
      .send({ questionId: question2._id, response: '5' }); // zła odpowiedź
    await request(app).post(`/${quiz2Id}/complete`).set('Authorization', token);

    const res = await request(app).get('/stats/trend').set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBeGreaterThanOrEqual(2);

    const percentages = res.body.results.map((r) => r.percentage);
    expect(percentages).toContain(0);
    expect(percentages).toContain(100);

    expect(percentages).toContain(0);
    expect(percentages).toContain(100);

    const dates = res.body.results.map((r) => new Date(r.completedAt).getTime());
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
    }
  });

  it('GET /stats/author/:id – returns stats for quiz author', async () => {
    const res = await request(app).get(`/stats/author/abc-123`).set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);

    const quizStats = res.body.find((q) => q.quizId === String(quiz1Id));
    expect(quizStats).toBeDefined();
    expect(quizStats.averageScore).toBeGreaterThanOrEqual(0);
    expect(quizStats.totalCompletions).toBeGreaterThanOrEqual(0);
  });
});
