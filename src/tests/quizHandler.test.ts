import { clearRequest, authRegisterRequest, quizCreateRequest, quizRemoveRequest } from './serverTestHelper';
import { person1, person2, validQuizName, validQuizDescription } from '../testingData';
import { Response } from 'sync-request-curl';

beforeEach(() => {
  clearRequest();
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
    const res = quizRemoveRequest(sess1data.token + 1, quiz1data.quizId);
    expect(res.statusCode).toStrictEqual(401);
  });

  test('invalid quiz', () => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    const res = quizRemoveRequest(sess1data.token, quiz1data.quizId + 1);
    expect(res.statusCode).toStrictEqual(400);
  });

  test(' quiz does not refer to a quiz user owns', () => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1data = JSON.parse(sess1.body.toString());
    const sess2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const sess2data = JSON.parse(sess2.body.toString());
    quiz1 = quizCreateRequest(sess1data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    const res = quizRemoveRequest(sess2data.token, quiz1data.quizId);
    expect(res.statusCode).toStrictEqual(403);
  });
});
