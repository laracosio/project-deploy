import { clearRequest, authRegisterRequest, quizCreateRequest, quizRemoveRequest, quizListRequest } from './serverTestHelper';
import { person1, person2, person3, validQuizName, validQuizDescription, shortQuizName, invalidQuizName, longQuizName, longQuizDescription } from '../testingData';
import { Response } from 'sync-request-curl';

beforeEach(() => {
  clearRequest();
});

// adminQuizCreate tests
describe('POST /v1/admin/quiz - Error Cases', () => {
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

describe('POST /v1/admin/quiz - Passed Cases', () => {
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

// adminQuizList tests
describe('GET /v1/admin/quiz/list - Error Cases', () => {
  test('invalid token', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const response = quizListRequest(userData.token + 1);
    expect(response.statusCode).toStrictEqual(401);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid token' });
  });
});

describe('GET /v1/admin/quiz/list - Passed Cases', () => {
  test('valid user1 list', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const quiz1 = quizCreateRequest(userData.token, 'User1 first quiz', 'Description 1');
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quiz2 = quizCreateRequest(userData.token, 'User1 second quiz', 'Description 2');
    const quiz2Data = JSON.parse(quiz2.body.toString());

    const response = quizListRequest(userData.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizzes: [
          {
            quizId: quiz1Data.quizId,
            name: 'User1 first quiz',
          },
          {
            quizId: quiz2Data.quizId,
            name: 'User1 second quiz',
          },
        ]
      }
    );
  });
  test('valid user2 list', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    quizCreateRequest(userData.token, 'User1 first quiz', 'Description 1');
    quizCreateRequest(userData.token, 'User1 second quiz', 'Description 2');
    const user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user2.body.toString());
    const user2Quiz = quizCreateRequest(user2Data.token, 'User2 first quiz', 'User2 Description');
    const user2QuizData = JSON.parse(user2Quiz.body.toString());
    const response = quizListRequest(user2Data.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizzes: [
          {
            quizId: user2QuizData.quizId,
            name: 'User2 first quiz',
          },
        ]
      }
    );
  });
  test('valid user3 list', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user1.body.toString());
    quizCreateRequest(userData.token, 'User1 first quiz', '');
    quizCreateRequest(userData.token, 'User1 second quiz', '');
    quizCreateRequest(userData.token, 'User1 third quiz', '');
    const user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user2.body.toString());
    quizCreateRequest(user2Data.token, 'User2 first quiz', '');
    quizCreateRequest(user2Data.token, 'User2 second quiz', '');
    quizCreateRequest(user2Data.token, 'User2 third quiz', '');
    const user3 = authRegisterRequest(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const user3Data = JSON.parse(user3.body.toString());
    const quiz1 = quizCreateRequest(user3Data.token, 'User3 first quiz', '');
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quiz2 = quizCreateRequest(user3Data.token, 'User3 second quiz', '');
    const quiz2Data = JSON.parse(quiz2.body.toString());
    const quiz3 = quizCreateRequest(user3Data.token, 'User3 third quiz', '');
    const quiz3Data = JSON.parse(quiz3.body.toString());
    const quiz4 = quizCreateRequest(user3Data.token, 'User3 fourth quiz', '');
    const quiz4Data = JSON.parse(quiz4.body.toString());
    const response = quizListRequest(user3Data.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizzes: [
          {
            quizId: quiz1Data.quizId,
            name: 'User3 first quiz',
          },
          {
            quizId: quiz2Data.quizId,
            name: 'User3 second quiz',
          },
          {
            quizId: quiz3Data.quizId,
            name: 'User3 third quiz',
          },
          {
            quizId: quiz4Data.quizId,
            name: 'User3 fourth quiz',
          },
        ]
      }
    );
  });
});
