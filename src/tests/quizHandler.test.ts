import { clearRequest, authRegisterRequest, quizCreateRequest, quizRemoveRequest } from './serverTestHelper';
import { person1, person2, validQuizName, validQuizDescription, shortQuizName, invalidQuizName, longQuizName, longQuizDescription } from '../testingData';
import { Response } from 'sync-request-curl';

beforeEach(() => {
  clearRequest();
});

// adminQuizCreate tests
describe('quizRouter.post - Error Cases', () => {
  test('invalid token', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = quizCreateRequest(userData.token + 1, validQuizName, validQuizDescription);
    expect(response.statusCode).toStrictEqual(401);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid token' });
  });
  test('invalid name characters', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = quizCreateRequest(userData.token, invalidQuizName, validQuizDescription);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid name, must not contain special characters' });
  });
  test('invalid name length too short', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = quizCreateRequest(userData.token, shortQuizName, validQuizDescription);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid name length' });
  });
  test('invalid name length too long', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = quizCreateRequest(userData.token, longQuizName, validQuizDescription);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid name length' });
  });
  test('existing name under same user', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const response = quizCreateRequest(userData.token, validQuizName, '');
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Quiz name already in use' });
  });
  test('invalid description length', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = quizCreateRequest(userData.token, validQuizName, longQuizDescription);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Description must be less than 100 characters' });
  });
});

describe('quizRouter.post - Passed Cases', () => {
  test('valid quiz details', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ quizId: expect.any(Number) });
  });
  test('valid multiple quiz details', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    quizCreateRequest(userData.token, 'Quiz 1', '');
    quizCreateRequest(userData.token, 'Quiz 2', '');
    quizCreateRequest(userData.token, 'Quiz 3', '');
    const response = quizCreateRequest(userData.token, 'Quiz 4', validQuizDescription);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ quizId: expect.any(Number) });
  });
  test('existing name under different user', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user2.body.toString());
    const response = quizCreateRequest(user2Data.token, validQuizName, '');
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ quizId: expect.any(Number) });
  });
});

describe('quizRemove Server - Success', () => {
  let sess1: Response, quiz1: Response;
  test('1 quiz created - 1 removed', () => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    const res = quizRemoveRequest(quiz1data.quizId, sess1data.token);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
  });
  test('2 quiz Created - 1 removed', () => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1data = JSON.parse(sess1.body.toString());
    quizCreateRequest(sess1data.token, 'Valid Quiz Name', validQuizDescription);
    const quiz2 = quizCreateRequest(sess1data.token, validQuizName, validQuizDescription);
    const quiz2data = JSON.parse(quiz2.body.toString());
    const res = quizRemoveRequest(quiz2data.quizId, sess1data.token);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    // const currQuiz = quizInfoRequest(quiz2data.quizId, sess1data.token);
    // expect(currQuiz.statusCode).toStrictEqual(400);
  });
});

describe('QuizRemove Server - Error', () => {
  let sess1: Response, quiz1: Response;
  test('invalid token', () => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    const res = quizRemoveRequest(quiz1data.quizId, sess1data.token + 1);
    expect(res.statusCode).toStrictEqual(401);
  });

  test('invalid quiz', () => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    const res = quizRemoveRequest(quiz1data.quizId + 1, sess1data.token);
    expect(res.statusCode).toStrictEqual(400);
  });

  test(' quiz does not refer to a quiz user owns', () => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1data = JSON.parse(sess1.body.toString());
    const sess2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const sess2data = JSON.parse(sess2.body.toString());
    // person1 creates quiz1
    quiz1 = quizCreateRequest(sess1data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    const res = quizRemoveRequest(quiz1data.quizId, sess2data.token);
    expect(res.statusCode).toStrictEqual(403);
  });
});
