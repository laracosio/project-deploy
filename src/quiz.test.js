// function imports
import {
  person1,
  person2,
  person3,
  person4,
  person5,
  validQuizName,
  newvalidQuizName,
  invalidQuizName,
  shortQuizName,
  longQuizName,
  validQuizDescription,
  newvalidQuizDescription,
  longQuizDescription,
} from './testingData.js';

import { adminQuizCreate, adminQuizInfo, adminQuizList, adminQuizRemove, adminQuizNameUpdate, adminQuizDescriptionUpdate } from './quiz';
import { adminAuthRegister } from './auth';
import { clear } from './other';

// test reset
beforeEach(() => {
  clear();
});

const ERROR = { error: expect.any(String) };

// adminQuizCreate tests
describe('adminQuizCreate - Error Cases', () => {
  test('invalid authUserId', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    expect(adminQuizCreate(session.token + 1, validQuizName, validQuizDescription).error).toStrictEqual('Invalid user');
  });
  test('invalid name characters', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    expect(adminQuizCreate(session.token, invalidQuizName, validQuizDescription).error).toStrictEqual('Invalid name, must not contain special characters');
  });
  test('invalid name length too short', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    expect(adminQuizCreate(session.token, shortQuizName, validQuizDescription).error).toStrictEqual('Invalid name length');
  });
  test('invalid name length too long', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    expect(adminQuizCreate(session.token, longQuizName, validQuizDescription).error).toStrictEqual('Invalid name length');
  });
  test('existing name under same user', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminQuizCreate(session.token, validQuizName, validQuizDescription);
    const invalidSecondQuizName = validQuizName;
    expect(adminQuizCreate(session.token, invalidSecondQuizName, validQuizDescription).error).toStrictEqual('Quiz name already in use');
  });
  test('existing name under different user', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminQuizCreate(session.token, validQuizName, validQuizDescription);
    adminQuizCreate(session.token, 'Quiz 2', validQuizDescription);
    adminQuizCreate(session.token, 'Quiz 3', validQuizDescription);
    adminQuizCreate(session2.token, 'Potato Quiz', validQuizDescription);
    expect(adminQuizCreate(session2.token, validQuizName, validQuizDescription).quizId).toStrictEqual(expect.any(Number));
  });
  test('invalid description length', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    expect(adminQuizCreate(session.token, validQuizName, longQuizDescription).error).toStrictEqual('Description must be less than 100 characters');
  });
});

describe('adminQuizCreate - Passed Cases', () => {
  test('valid quiz details', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quizCreate = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    expect(quizCreate.quizId).toStrictEqual(expect.any(Number));
  });
  test('valid multiple quiz details', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminQuizCreate(session.token, validQuizName, validQuizDescription);
    const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminQuizCreate(session2.token, 'Quiz 2', '');
    adminQuizCreate(session2.token, 'Quiz 3', '');
    expect(adminQuizCreate(session2.token, 'Quiz 4', '')).toMatchObject({ quizId: expect.any(Number) });
  });
});

// tests for adminQuizRemove
describe('adminQuizRemove - Success Cases', () => {
  test('1 quiz created - 1 removed', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(session.token, 'Misc Quiz Name', 'Misc Quiz Description');
    expect(adminQuizRemove(session.token, quiz.quizId)).toStrictEqual({});
  });
  test('2 quiz created - 1 removed', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminQuizCreate(session.token, 'Misc Quiz Name', 'Misc Quiz Description');
    const quiz2 = adminQuizCreate(session.token, 'Misc Quiz Name2', 'Misc Quiz Description2');
    expect(adminQuizRemove(session.token, quiz2.quizId)).toStrictEqual({});
  });
  test('multiple quizzes create, multiple quizzes removed', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sessionB = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminQuizCreate(session.token, 'Quiz1', 'Misc Quiz Description');
    const quiz2 = adminQuizCreate(session.token, 'Quiz2', 'Misc Quiz Description2');
    adminQuizCreate(session.token, 'Quiz3', 'Misc Quiz Description3');
    const quiz4 = adminQuizCreate(session.token, 'Quiz4', 'Misc Quiz Description4');
    const quiz5 = adminQuizCreate(sessionB.token, 'Quiz5', 'Misc Quiz Description5');
    adminQuizCreate(sessionB.token, 'Quiz6', 'Misc Quiz Description6');
    const quiz7 = adminQuizCreate(sessionB.token, 'Quiz7', 'Misc Quiz Description7');
    adminQuizCreate(sessionB.token, 'Quiz8', 'Misc Quiz Description8');
    expect(adminQuizRemove(sessionB.token, quiz7.quizId)).toStrictEqual({});
    expect(adminQuizRemove(session.token, quiz4.quizId)).toStrictEqual({});
    expect(adminQuizRemove(sessionB.token, quiz5.quizId)).toStrictEqual({});
    expect(adminQuizRemove(session.token, quiz2.quizId)).toStrictEqual({});
  });
});

describe('adminQuizRemove - Error Cases', () => {
  test('invalid token', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(session.token, 'Misc Quiz Name', 'Misc Quiz Description');
    expect(adminQuizRemove(session.token + 1, quiz.quizId)).toStrictEqual(ERROR);
  });
  test('invalid quiz', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(session.token, 'Misc Quiz Name', 'Misc Quiz Description');
    expect(adminQuizRemove(session.token, quiz.quizId + 1)).toStrictEqual(ERROR);
  });
  test('Quiz does not refer to a quiz that this user owns', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sessionB = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const quiz = adminQuizCreate(session.token, 'Misc Quiz Name', 'Misc Quiz Description');
    expect(adminQuizRemove(sessionB.token, quiz.quizId)).toStrictEqual(ERROR);
  });
  test('empty token', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(session.token, 'Misc Quiz Name', 'Misc Quiz Description');
    expect(adminQuizRemove('', quiz.quizId)).toStrictEqual(ERROR);
  });
  test('empty quizId', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    expect(adminQuizRemove(session.token, '')).toStrictEqual(ERROR);
  });
});

// adminQuizInfo tests
describe('adminQuizInfo - Error Cases', () => {
  test('invalid authUserId', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    expect(adminQuizInfo(session.token + 100, validQuizId.quizId).error).toStrictEqual('Invalid user');
  });
  test('invalid quizId', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    expect(adminQuizInfo(session.token, validQuizId.quizId + 100).error).toStrictEqual('Invalid quiz ID');
  });
  test('quizId not owned by this user', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    expect(adminQuizInfo(session2.token, validQuizId.quizId).error).toStrictEqual('Quiz ID not owned by this user');
  });
});

describe('adminQuizInfo - Passed Cases', () => {
  test('one valid token and quizId', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    expect(adminQuizInfo(session.token, validQuizId.quizId)).toStrictEqual(
      {
        quizId: validQuizId.quizId,
        name: validQuizName,
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: validQuizDescription,
      }
    );
  });
  test('find user2 quiz from dataStore with two registered users', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminQuizCreate(session.token, validQuizName, validQuizDescription);
    const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const session2Quiz = adminQuizCreate(session2.token, 'User2s quiz', '');
    expect(adminQuizInfo(session2.token, session2Quiz.quizId)).toStrictEqual(
      {
        quizId: session2Quiz.quizId,
        name: 'User2s quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: '',
      }
    );
  });
  test('find user5 quiz from dataStore with five registered users', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminQuizCreate(session.token, validQuizName, validQuizDescription);
    const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminQuizCreate(session2.token, 'User2s quiz', '');
    adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
    const session5 = adminAuthRegister(person5.email, person5.password, person5.nameFirst, person5.nameLast);
    const session5Quiz = adminQuizCreate(session5.token, 'User5s quiz', '');
    expect(adminQuizInfo(session5.token, session5Quiz.quizId)).toStrictEqual(
      {
        quizId: session5Quiz.quizId,
        name: 'User5s quiz',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: '',
      }
    );
  });
});

// adminQuizList tests
describe('adminQuizList - Error Cases', () => {
  test('invalid authUserId', () => {
    const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    expect(adminQuizList(validUser1.authUserId + 100).error).toStrictEqual('Invalid user');
  });
});

describe('adminQuizList - Passed Cases', () => {
  test('valid user1 list', () => {
    const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuiz1 = adminQuizCreate(validUser1.authUserId, 'User1 first quiz', '');
    const validQuiz2 = adminQuizCreate(validUser1.authUserId, 'User1 second quiz', '');
    expect(adminQuizList(validUser1.authUserId)).toStrictEqual(
      {
        quizzes: [
          {
            quizId: validQuiz1.quizId,
            name: 'User1 first quiz',
          },
          {
            quizId: validQuiz2.quizId,
            name: 'User1 second quiz',
          },
        ]
      }
    );
  });
  test('valid user2 list', () => {
    const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminQuizCreate(validUser1.authUserId, 'User1 first quiz', '');
    adminQuizCreate(validUser1.authUserId, 'User1 second quiz', '');
    const validUser2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const validQuiz3 = adminQuizCreate(validUser2.authUserId, 'User2 first quiz', '');
    expect(adminQuizList(validUser2.authUserId)).toStrictEqual(
      {
        quizzes: [
          {
            quizId: validQuiz3.quizId,
            name: 'User2 first quiz',
          },
        ]
      }
    );
  });
  test('valid user3 list', () => {
    const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminQuizCreate(validUser1.authUserId, 'User1 first quiz', '');
    adminQuizCreate(validUser1.authUserId, 'User1 second quiz', '');
    adminQuizCreate(validUser1.authUserId, 'User1 third quiz', '');
    const validUser2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminQuizCreate(validUser2.authUserId, 'User2 first quiz', '');
    adminQuizCreate(validUser2.authUserId, 'User2 second quiz', '');
    adminQuizCreate(validUser2.authUserId, 'User2 third quiz', '');
    const validUser3 = adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const validQuiz7 = adminQuizCreate(validUser3.authUserId, 'User3 first quiz', '');
    const validQuiz8 = adminQuizCreate(validUser3.authUserId, 'User3 second quiz', '');
    const validQuiz9 = adminQuizCreate(validUser3.authUserId, 'User3 third quiz', '');
    const validQuiz10 = adminQuizCreate(validUser3.authUserId, 'User3 fourth quiz', '');
    expect(adminQuizList(validUser3.authUserId)).toStrictEqual(
      {
        quizzes: [
          {
            quizId: validQuiz7.quizId,
            name: 'User3 first quiz',
          },
          {
            quizId: validQuiz8.quizId,
            name: 'User3 second quiz',
          },
          {
            quizId: validQuiz9.quizId,
            name: 'User3 third quiz',
          },
          {
            quizId: validQuiz10.quizId,
            name: 'User3 fourth quiz',
          },
        ]
      }
    );
  });
});

// adminQuizNameUpdate tests
describe('adminQuizNameUpdate - Success Cases', () => {
  test('valid authUserId, quizId and name', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizNameUpdate(validUserId.authUserId, validQuizId.quizId, newvalidQuizName)).toStrictEqual({});
  });
});

describe('adminQuizNameUpdate - Error Cases', () => {
  test('invalid authUserId', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizNameUpdate(validUserId.authUserId + 1, validQuizId.quizId, newvalidQuizName)).toStrictEqual(ERROR);
  });
  test('invalid QuizId', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizNameUpdate(validUserId.authUserId, validQuizId.quizId + 1, newvalidQuizName)).toStrictEqual(ERROR);
  });
  test('QuizId not owned by this user', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validUserId2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizNameUpdate(validUserId2.authUserId, validQuizId.quizId, newvalidQuizName)).toStrictEqual(ERROR);
  });
  test('Name contains invalid characters', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizNameUpdate(validUserId.authUserId, validQuizId.quizId, invalidQuizName)).toStrictEqual(ERROR);
  });
  test('invalid Name length - too long', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizNameUpdate(validUserId.authUserId, validQuizId.quizId, longQuizName)).toStrictEqual(ERROR);
  });
  test('invalid Name length - too short', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizNameUpdate(validUserId.authUserId, validQuizId.quizId, shortQuizName)).toStrictEqual(ERROR);
  });
  test('Name already in use', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    const NameAlreadyExists = validQuizName;
    expect(adminQuizNameUpdate(validUserId.authUserId, validQuizId.quizId, NameAlreadyExists)).toStrictEqual(ERROR);
  });
});

// adminQuizDescriptionUpdate tests
describe('adminQuizDescriptionUpdate - Success Cases', () => {
  test('valid authUserId, quizId and description', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizDescriptionUpdate(validUserId.authUserId, validQuizId.quizId, newvalidQuizDescription)).toStrictEqual({});
  });
});

describe('adminQuizDescriptionUpdate - Error Cases', () => {
  test('invalid authUserId', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizDescriptionUpdate(validUserId.authUserId + 1, validQuizId.quizId, newvalidQuizDescription)).toStrictEqual(ERROR);
  });
  test('invalid QuizId', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizDescriptionUpdate(validUserId.authUserId, validQuizId.quizId + 1, newvalidQuizDescription)).toStrictEqual(ERROR);
  });
  test('QuizId not owned by this user', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validUserId2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizDescriptionUpdate(validUserId2.authUserId, validQuizId.quizId, newvalidQuizDescription)).toStrictEqual(ERROR);
  });
  test('Description is longer than 100 characters', () => {
    const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
    expect(adminQuizDescriptionUpdate(validUserId.authUserId, validQuizId.quizId, longQuizDescription)).toStrictEqual(ERROR);
  });
});
