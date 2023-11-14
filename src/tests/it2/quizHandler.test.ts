import { authRegisterRequest, clearRequest, quizCreateRequest, quizRemoveRequest, quizInfoRequest, quizListRequest, quizNameUpdateRequest, quizDescriptUpdateRequest, quizTransferRequest, authLoginRequest, authLogoutRequest } from './serverTestHelperIt2';
import { person1, person2, person3, person4, person5, validQuizName, validQuizDescription, shortQuizName, invalidQuizName, longQuizName, longQuizDescription, newvalidQuizName, newvalidQuizDescription } from '../../testingData';
import { Response } from 'sync-request-curl';
import { getUnixTime } from 'date-fns';

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

describe('DELETE /v1/admin/quiz/{quizid} - Success', () => {
  let sess1: Response, quiz1: Response;
  test('1 quiz created - 1 removed', () => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    const res = quizRemoveRequest(sess1data.token, quiz1data.quizId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
  });
  test('2 quiz Created - 1 removed', () => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1data = JSON.parse(sess1.body.toString());
    quizCreateRequest(sess1data.token, 'Valid Quiz Name', validQuizDescription);
    const quiz2 = quizCreateRequest(sess1data.token, validQuizName, validQuizDescription);
    const quiz2data = JSON.parse(quiz2.body.toString());
    const res = quizRemoveRequest(sess1data.token, quiz2data.quizId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    // should no longer be able to run quizInfo
    const currQuiz = quizInfoRequest(sess1data.token, quiz2data.quizId);
    expect(currQuiz.statusCode).toStrictEqual(400);
  });
});

describe('DELETE /v1/admin/quiz/{quizid} - Error', () => {
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
    // person1 creates quiz1
    quiz1 = quizCreateRequest(sess1data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    const res = quizRemoveRequest(sess2data.token, quiz1data.quizId);
    expect(res.statusCode).toStrictEqual(403);
  });
});

// adminQuizInfo tests
describe('GET /v1/admin/quiz/{quizid} - Error Cases', () => {
  test('invalid token', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const quiz = quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const quizData = JSON.parse(quiz.body.toString());
    const response = quizInfoRequest(userData.token + 1, quizData.quizId);
    expect(response.statusCode).toStrictEqual(401);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid token' });
  });
  test('invalid quizId', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const quiz = quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const quizData = JSON.parse(quiz.body.toString());
    const response = quizInfoRequest(userData.token, quizData.quizId + 100);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid quiz ID' });
  });

  test('quizId not owned by this user', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());

    const quiz = quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const quizData = JSON.parse(quiz.body.toString());

    const user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user2.body.toString());

    const response = quizInfoRequest(user2Data.token, quizData.quizId);

    expect(response.statusCode).toStrictEqual(403);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'User does not own quiz to check info' });
  });
});

describe('GET /v1/admin/quiz/{quizid} - Passed Cases', () => {
  test('one valid authUserId and quizId', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const quiz = quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const quizData = JSON.parse(quiz.body.toString());
    const response = quizInfoRequest(userData.token, quizData.quizId);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizId: quizData.quizId,
        name: validQuizName,
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: validQuizDescription,
        numQuestions: 0,
        questions: [],
        duration: 0
      }
    );
  });
  test('find user2 quiz from dataStore with two registered users', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user2.body.toString());
    const quiz2 = quizCreateRequest(user2Data.token, 'Potato Quiz', 'Cool Description');
    const quiz2Data = JSON.parse(quiz2.body.toString());
    const response = quizInfoRequest(user2Data.token, quiz2Data.quizId);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizId: quiz2Data.quizId,
        name: 'Potato Quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Cool Description',
        numQuestions: 0,
        questions: [],
        duration: 0
      }
    );
  });
  test('find user5 quiz from dataStore with five registered users', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user2.body.toString());
    quizCreateRequest(user2Data.token, 'Quiz 2', 'Description 2');
    const user3 = authRegisterRequest(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const user3Data = JSON.parse(user3.body.toString());
    quizCreateRequest(user3Data.token, 'Quiz 3', 'Description 3');
    const user4 = authRegisterRequest(person4.email, person4.password, person4.nameFirst, person4.nameLast);
    const user4Data = JSON.parse(user4.body.toString());
    quizCreateRequest(user4Data.token, 'Quiz 4', 'Description 4');
    const user5 = authRegisterRequest(person5.email, person5.password, person5.nameFirst, person5.nameLast);
    const user5Data = JSON.parse(user5.body.toString());
    const quiz5 = quizCreateRequest(user5Data.token, 'Quiz 5', 'Description 5');
    const quiz5Data = JSON.parse(quiz5.body.toString());
    const response = quizInfoRequest(user5Data.token, quiz5Data.quizId);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizId: quiz5Data.quizId,
        name: 'Quiz 5',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Description 5',
        numQuestions: 0,
        questions: [],
        duration: 0
      }
    );
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

// adminQuizNameUpdate tests
describe('adminQuizNameUpdate - Success Cases', () => {
  let session1: Response, quiz1: Response;
  test('valid authUserId, quizId and name', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizNameUpdateRequest(session1Data.token, quiz1Data.quizId, newvalidQuizName);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
});

describe('adminQuizNameUpdate - Error Cases', () => {
  let session1: Response, session2: Response, quiz1: Response;
  test('invalid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizNameUpdateRequest(session1Data.token + 1, quiz1Data.quizId, newvalidQuizName);
    expect(response.statusCode).toStrictEqual(401);
  });
  test('invalid QuizId', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizNameUpdateRequest(session1Data.token, quiz1Data.quizId + 1, newvalidQuizName);
    expect(response.statusCode).toStrictEqual(400);
  });
  test('QuizId not owned by this user', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1data = JSON.parse(session1.body.toString());
    session2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const session2data = JSON.parse(session2.body.toString());
    quiz1 = quizCreateRequest(session1data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    const response = quizNameUpdateRequest(session2data.token, quiz1data.quizId, newvalidQuizName);
    expect(response.statusCode).toStrictEqual(403);
  });
  test('Name contains invalid characters', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizNameUpdateRequest(session1Data.token, quiz1Data.quizId + 1, newvalidQuizName);
    expect(response.statusCode).toStrictEqual(400);
  });
  test('invalid Name length - too long', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizNameUpdateRequest(session1Data.token, quiz1Data.quizId, longQuizName);
    expect(response.statusCode).toStrictEqual(400);
  });
  test('invalid Name length - too short', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizNameUpdateRequest(session1Data.token, quiz1Data.quizId, shortQuizName);
    expect(response.statusCode).toStrictEqual(400);
  });
  test('Name already in use', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const NameAlreadyExists = validQuizName;
    const response = quizNameUpdateRequest(session1Data.token, quiz1Data.quizId, NameAlreadyExists);
    expect(response.statusCode).toStrictEqual(400);
  });
});

// adminQuizDescriptionUpdate tests
describe('adminQuizDescriptionUpdate - Success Cases', () => {
  let session1: Response, quiz1: Response;
  test('valid authUserId, quizId and name', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizDescriptUpdateRequest(session1Data.token, quiz1Data.quizId, newvalidQuizName);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
});

describe('adminQuizDescriptionUpdate - Error Cases', () => {
  let session1: Response, session2: Response, quiz1: Response;
  test('invalid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizDescriptUpdateRequest(session1Data.token + 1, quiz1Data.quizId, newvalidQuizDescription);
    expect(response.statusCode).toStrictEqual(401);
  });
  test('invalid QuizId', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizDescriptUpdateRequest(session1Data.token, quiz1Data.quizId + 1, newvalidQuizDescription);
    expect(response.statusCode).toStrictEqual(400);
  });
  test('QuizId not owned by this user', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1data = JSON.parse(session1.body.toString());
    session2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const session2data = JSON.parse(session2.body.toString());
    quiz1 = quizCreateRequest(session1data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    const response = quizDescriptUpdateRequest(session2data.token, quiz1data.quizId, newvalidQuizDescription);
    expect(response.statusCode).toStrictEqual(403);
  });
  test('Description is longer than 100 characters', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizDescriptUpdateRequest(session1Data.token, quiz1Data.quizId, longQuizDescription);
    expect(response.statusCode).toStrictEqual(400);
  });
});

describe('POST /v1/admin/quiz/{quizId}/transfer - Success', () => {
  let sess1: Response, sess2: Response, quiz1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
    sess2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
  });
  test('transfer to from person1 to person2 and then to person3', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const sess2Data = JSON.parse(sess2.body.toString());
    const res = quizTransferRequest(sess1Data.token, quiz1Data.quizId, person2.email);
    expect(JSON.parse(res.body.toString())).toStrictEqual({});

    const quizInfo1 = quizInfoRequest(sess2Data.token, quiz1Data.quizId);
    expect(quizInfo1.statusCode).toStrictEqual(200);
    expect(JSON.parse(quizInfo1.body.toString()).timeLastEdited).toBeGreaterThanOrEqual(getUnixTime(new Date()));

    const sess3 = authRegisterRequest(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const sess3Data = JSON.parse(sess3.body.toString());
    const res2 = quizTransferRequest(sess2Data.token, quiz1Data.quizId, person3.email);
    expect(JSON.parse(res2.body.toString())).toStrictEqual({});
    const trashQuiz = quizRemoveRequest(sess3Data.token, quiz1Data.quizId);
    expect(JSON.parse(trashQuiz.body.toString())).toStrictEqual({});
  });
});

describe('POST /v1/admin/quiz/{quizId}/transfer - Error', () => {
  let sess1: Response, sess2: Response, quiz1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
    sess2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
  });
  test('Quiz ID does not refer to a valid quiz', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const res = quizTransferRequest(sess1Data.token, quiz1Data.quizId + 1, person2.email);
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('userEmail is not a real user', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const res = quizTransferRequest(sess1Data.token, quiz1Data.quizId, person3.email);
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('userEmail is the same token-sessionId', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const res = quizTransferRequest(sess1Data.token, quiz1Data.quizId, person1.email);
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('userEmail is the current logged in user', () => {
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const sameUser = authLoginRequest(person1.email, person1.password);
    const sameUserData = JSON.parse(sameUser.body.toString());
    const res = quizTransferRequest(sameUserData.token, quiz1Data.quizId, person1.email);
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const sess2Data = JSON.parse(sess2.body.toString());
    quizCreateRequest(sess2Data.token, validQuizName, validQuizDescription);
    const res = quizTransferRequest(sess1Data.token, quiz1Data.quizId, person2.email);
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Token is empty)', () => {
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const res = quizTransferRequest('', quiz1Data.quizId, person2.email);
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });
  test('Token is invalid (does not refer to valid logged in user session)', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    authLogoutRequest(sess1Data.token);
    const res = quizTransferRequest(sess1Data.token, quiz1Data.quizId, person2.email);
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });
  test('Valid token is provided, but user is not an owner of this quiz', () => {
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const sess2Data = JSON.parse(sess2.body.toString());
    authRegisterRequest(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const res = quizTransferRequest(sess2Data.token, quiz1Data.quizId, person3.email);
    expect(JSON.parse(res.body.toString())).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(403);
  });
});
