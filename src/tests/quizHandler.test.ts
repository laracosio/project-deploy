import { authRegisterRequest, clearRequest, quizCreateRequest, quizInfoRequest } from './serverTestHelper'
import {
  person1,
  person2,
  person3,
  person4,
  person5,
  validQuizName,
  invalidQuizName,
  shortQuizName,
  longQuizName,
  validQuizDescription,
  longQuizDescription,
} from '../testingData';

beforeEach(() => {
  clearRequest();
});

// adminQuizCreate tests
describe('quizCreateRouter.post - Error Cases', () => {
  test('invalid token', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = quizCreateRequest(userData.token + 1, validQuizName, validQuizDescription);
    expect(response.statusCode).toStrictEqual(401);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid token'});
  });
  test('invalid name characters', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = quizCreateRequest(userData.token, invalidQuizName, validQuizDescription);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid name, must not contain special characters'});
  });
  test('invalid name length too short', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = quizCreateRequest(userData.token, shortQuizName, validQuizDescription);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid name length'});
  });
  test('invalid name length too long', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = quizCreateRequest(userData.token, longQuizName, validQuizDescription);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid name length'});
  });
  test('existing name under same user', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const response = quizCreateRequest(userData.token, validQuizName, '');
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Quiz name already in use'});
  });
  test('invalid description length', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = quizCreateRequest(userData.token, validQuizName, longQuizDescription);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Description must be less than 100 characters'});
  });
});

describe('quizCreateRouter.post - Passed Cases', () => {
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

// adminQuizInfo tests
describe('quizInfoRouter.get - Error Cases', () => {
  test('invalid token', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const quiz = quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const quizData = JSON.parse(quiz.body.toString());
    const response = quizInfoRequest(quizData.quizId, `${userData.token}9`);
    expect(response.statusCode).toStrictEqual(401);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid token'});
  });
  test('invalid quizId', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const quiz = quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const quizData = JSON.parse(quiz.body.toString());
    const response = quizInfoRequest(quizData.quizId + 1, userData.token);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid quiz ID'});
  });
  test('quizId not owned by this user', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const quiz = quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const quizData = JSON.parse(quiz.body.toString());
    const user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user.body.toString());
    const response = quizInfoRequest(quizData.quizId, user2Data.token);
    expect(response.statusCode).toStrictEqual(403);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'User does not own quiz to check info'});
  });
});

describe('quizInfoRouter.get - Passed Cases', () => {
  test('one valid authUserId and quizId', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const quiz = quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const quizData = JSON.parse(quiz.body.toString());
    const response = quizInfoRequest(quizData.quizId, userData.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizId: quizData.quizId,
        name: validQuizName,
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: validQuizDescription,
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
    const response = quizInfoRequest(quiz2Data.quizId, user2Data.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizId: quiz2Data.quizId,
        name: 'Potato Quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Cool Description',
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
    const response = quizInfoRequest(quiz5Data.quizId, user5Data.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizId: quiz5Data.quizId,
        name: 'Quiz 5',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Description 5',
      }
    );
  });
});