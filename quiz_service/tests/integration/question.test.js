const request = require('supertest');
const mongoose = require('mongoose');
const connectMongo = require('../../src/db/connectMongoTest');
const Quiz = require('../../src/db/mongo/models/quizz');
const Question = require('../../src/db/mongo/models/question');

const app = require('../../src/apptest');

jest.setTimeout(5000);

const mockUser = {
  keycloakId: 'abc-123',
  email: 'test@example.com',
};

let createdQuizId;
let createdQuestionId;

beforeAll(async () => {
  await connectMongo();
  await Quiz.deleteMany({});
  await Question.deleteMany({});

  const quiz = await Quiz.create({
    title: 'Test Quiz',
    description: 'Test description',
    difficulty: 'easy',
    duration: 60,
    isPrivate: false,
    isPublished: true,
    categories: [],
    tags: [],
    authorId: mockUser.keycloakId,
  });

  createdQuizId = quiz._id.toString();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('questionController E2E', () => {
  const token = 'Bearer mocked-token';

  it('POST /question – adds question', async () => {
    const res = await request(app)
      .post('/question')
      .set('Authorization', token)
      .send({
        quizId: createdQuizId,
        type: 'multiple-choice',
        text: 'Pytanie testowe',
        options: ['A', 'B', 'C'],
        correctAnswers: ['A', 'B'],
        points: 5,
        hint: 'Podpowiedź',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('Pytanie testowe');
    createdQuestionId = res.body._id;
  });

  it('GET /question/:id – get question by ID', async () => {
    const res = await request(app)
      .get(`/question/${createdQuestionId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdQuestionId);
  });

  it('PATCH /question/:id – edit question', async () => {
    const res = await request(app)
      .patch(`/question/${createdQuestionId}`)
      .set('Authorization', token)
      .send({ text: 'Zmienione pytanie' });

    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('Zmienione pytanie');
  });

  it('GET /question?quizId=... – get all questions for quiz', async () => {
    const res = await request(app)
      .get(`/question?quizId=${createdQuizId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('DELETE /question/:id – delete question', async () => {
    const res = await request(app)
      .delete(`/question/${createdQuestionId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(204);
  });
});
