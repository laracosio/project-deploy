import { Response } from 'sync-request-curl';
import { person1, person2, validQuizDescription, validQuizName } from '../../testingData';
import { authRegisterRequest, clearRequest, quizRemoveRequest, quizCreateRequest } from './serverTestHelperIt2';

describe('Clear - Success', () => {
  let user1: Response, user2: Response, quiz1: Response;

  test('empty clear', () => {
    expect(JSON.parse(clearRequest().body.toString())).toStrictEqual({});
  });

  test('one user, clear and attempt quizCreate', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1data = JSON.parse(user1.body.toString());
    expect(JSON.parse(clearRequest().body.toString())).toStrictEqual({});

    quiz1 = quizCreateRequest(user1data.token, validQuizName, validQuizDescription);
    expect(quiz1.statusCode).toBe(401);
    expect(JSON.parse(quiz1.body.toString())).toStrictEqual({ error: expect.any(String) });
  });

  test('one user, create quiz, clear and to trash', () => {
    user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2data = JSON.parse(user2.body.toString());
    quiz1 = quizCreateRequest(user2data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    expect(JSON.parse(clearRequest().body.toString())).toStrictEqual({});

    const removeQuiz = quizRemoveRequest(user2data.token, quiz1data.quizId);
    expect(removeQuiz.statusCode).toBeGreaterThanOrEqual(400);
    expect(removeQuiz.statusCode).toBeGreaterThanOrEqual(400);
    expect(JSON.parse(removeQuiz.body.toString())).toStrictEqual({ error: expect.any(String) });
  });
});
