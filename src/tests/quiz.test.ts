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
} from '../testingData';

import { adminQuizCreate, adminQuizInfo, adminQuizList, adminQuizNameUpdate, adminQuizDescriptionUpdate } from '../features/quiz';
import { adminQuizRemove } from '../features/trash';
import { adminAuthRegister } from '../features/auth';
import { clear } from '../features//other';
import { ApiError } from '../errors/ApiError';

// test reset
beforeEach(() => {
  clear();
});

// adminQuizCreate tests
describe('adminQuizCreate - Error Cases', () => {
  test('invalid token', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    function adminQuizCreateFunc() {
      adminQuizCreate(session.token + 1, validQuizName, validQuizDescription);
    }
    expect(adminQuizCreateFunc).toThrow(ApiError);
    expect(adminQuizCreateFunc).toThrow('Invalid token');
  });
  test('invalid name characters', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    function adminQuizCreateFunc() {
      adminQuizCreate(session.token, invalidQuizName, validQuizDescription);
    }
    expect(adminQuizCreateFunc).toThrow(ApiError);
    expect(adminQuizCreateFunc).toThrow('Invalid name, must not contain special characters');
  });
  test('invalid name length too short', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    function adminQuizCreateFunc() {
      adminQuizCreate(session.token, shortQuizName, validQuizDescription);
    }
    expect(adminQuizCreateFunc).toThrow(ApiError);
    expect(adminQuizCreateFunc).toThrow('Invalid name length');
  });
  test('invalid name length too long', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    function adminQuizCreateFunc() {
      adminQuizCreate(session.token, longQuizName, validQuizDescription);
    }
    expect(adminQuizCreateFunc).toThrow(ApiError);
    expect(adminQuizCreateFunc).toThrow('Invalid name length');
  });
  test('existing name under same user', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminQuizCreate(session.token, validQuizName, validQuizDescription);
    const invalidSecondQuizName = validQuizName;
    function adminQuizCreateFunc() {
      adminQuizCreate(session.token, invalidSecondQuizName, validQuizDescription);
    }
    expect(adminQuizCreateFunc).toThrow(ApiError);
    expect(adminQuizCreateFunc).toThrow('Quiz name already in use');
  });
  test('existing name under different user', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminQuizCreate(session.token, validQuizName, validQuizDescription);
    adminQuizCreate(session.token, 'Quiz 2', validQuizDescription);
    adminQuizCreate(session.token, 'Quiz 3', validQuizDescription);
    adminQuizCreate(session.token, 'Potato Quiz', validQuizDescription);
    expect(adminQuizCreate(session2.token, validQuizName, validQuizDescription).quizId).toStrictEqual(expect.any(Number));
  });
  test('invalid description length', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    function adminQuizCreateFunc() {
      adminQuizCreate(session.token, validQuizName, longQuizDescription);
    }
    expect(adminQuizCreateFunc).toThrow(ApiError);
    expect(adminQuizCreateFunc).toThrow('Description must be less than 100 characters');
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
  test('creating a quiz after moving a quiz to trash', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminQuizCreate(session.token, 'My Quiz 1', validQuizDescription);
    adminQuizCreate(session.token, 'My Quiz 2', validQuizDescription);
    const quiz3 = adminQuizCreate(session.token, 'My Quiz 3', validQuizDescription);
    adminQuizRemove(session.token, quiz3.quizId);
    expect(adminQuizCreate(session.token, 'My Quiz 4', validQuizDescription)).toMatchObject({ quizId: quiz3.quizId + 1 });
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
    function adminQuizRemoveFunc() {
      adminQuizRemove(session.token + 1, quiz.quizId);
    }
    expect(adminQuizRemoveFunc).toThrow(ApiError);
    expect(adminQuizRemoveFunc).toThrow('Invalid token');
  });
  test('invalid quiz', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(session.token, 'Misc Quiz Name', 'Misc Quiz Description');
    function adminQuizRemoveFunc() {
      adminQuizRemove(session.token, quiz.quizId + 1);
    }
    expect(adminQuizRemoveFunc).toThrow(ApiError);
    expect(adminQuizRemoveFunc).toThrow('Invalid quizId');
  });
  test('Quiz  does not refer to a quiz that this user owns', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sessionB = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const quiz = adminQuizCreate(session.token, 'Misc Quiz Name', 'Misc Quiz Description');
    function adminQuizRemoveFunc() {
      adminQuizRemove(sessionB.token, quiz.quizId);
    }
    expect(adminQuizRemoveFunc).toThrow(ApiError);
    expect(adminQuizRemoveFunc).toThrow('User does not own quiz to remove');
  });
});

// adminQuizInfo tests
describe('adminQuizInfo - Error Cases', () => {
  test('invalid token', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizInfoFunc() {
      adminQuizInfo(session.token + 100, validQuizId.quizId);
    }
    expect(adminQuizInfoFunc).toThrow(ApiError);
    expect(adminQuizInfoFunc).toThrow('Invalid token');
  });
  test('invalid quizId', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizInfoFunc() {
      adminQuizInfo(session.token, validQuizId.quizId + 100);
    }
    expect(adminQuizInfoFunc).toThrow(ApiError);
    expect(adminQuizInfoFunc).toThrow('Invalid quiz ID');
  });
  test('quizId not owned by this user', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    function adminQuizInfoFunc() {
      adminQuizInfo(session2.token, validQuizId.quizId);
    }
    expect(adminQuizInfoFunc).toThrow(ApiError);
    expect(adminQuizInfoFunc).toThrow('User does not own quiz to check info');
  });
});

describe('adminQuizInfo - Passed Cases', () => {
  test('one valid authUserId and quizId', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    expect(adminQuizInfo(session.token, validQuizId.quizId)).toStrictEqual(
      {
        quizId: validQuizId.quizId,
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
        numQuestions: 0,
        questions: [],
        duration: 0
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
        numQuestions: 0,
        questions: [],
        duration: 0
      }
    );
  });
});

// adminQuizList tests
describe('adminQuizList - Error Cases', () => {
  test('invalid token', () => {
    const session1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    function adminQuizListFunc() {
      adminQuizList(session1.token + 100);
    }
    expect(adminQuizListFunc).toThrow(ApiError);
    expect(adminQuizListFunc).toThrow('Invalid token');
  });
});

describe('adminQuizList - Passed Cases', () => {
  test('valid user1 list', () => {
    const session1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuiz1 = adminQuizCreate(session1.token, 'User1 first quiz', '');
    const validQuiz2 = adminQuizCreate(session1.token, 'User1 second quiz', '');
    expect(adminQuizList(session1.token)).toStrictEqual(
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
    const session1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminQuizCreate(session1.token, 'User1 first quiz', '');
    adminQuizCreate(session1.token, 'User1 second quiz', '');
    const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const validQuiz3 = adminQuizCreate(session2.token, 'User2 first quiz', '');
    expect(adminQuizList(session2.token)).toStrictEqual(
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
    const session1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminQuizCreate(session1.token, 'User1 first quiz', '');
    adminQuizCreate(session1.token, 'User1 second quiz', '');
    adminQuizCreate(session1.token, 'User1 third quiz', '');
    const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminQuizCreate(session2.token, 'User2 first quiz', '');
    adminQuizCreate(session2.token, 'User2 second quiz', '');
    adminQuizCreate(session2.token, 'User2 third quiz', '');
    const session3 = adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const validQuiz7 = adminQuizCreate(session3.token, 'User3 first quiz', '');
    const validQuiz8 = adminQuizCreate(session3.token, 'User3 second quiz', '');
    const validQuiz9 = adminQuizCreate(session3.token, 'User3 third quiz', '');
    const validQuiz10 = adminQuizCreate(session3.token, 'User3 fourth quiz', '');
    expect(adminQuizList(session3.token)).toStrictEqual(
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
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    expect(adminQuizNameUpdate(session.token, validQuizId.quizId, newvalidQuizName)).toStrictEqual({});
  });
});

describe('adminQuizNameUpdate - Error Cases', () => {
  test('invalid token', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizNameUpdateFunc() {
      adminQuizNameUpdate(session.token + 100, validQuizId.quizId, newvalidQuizName);
    }
    expect(adminQuizNameUpdateFunc).toThrow(ApiError);
    expect(adminQuizNameUpdateFunc).toThrow('Invalid token');
  });
  test('invalid QuizId', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizNameUpdateFunc() {
      adminQuizNameUpdate(session.token, validQuizId.quizId + 100, newvalidQuizName);
    }
    expect(adminQuizNameUpdateFunc).toThrow(ApiError);
    expect(adminQuizNameUpdateFunc).toThrow('Invalid quiz ID');
  });
  test('QuizId not owned by this user', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizNameUpdateFunc() {
      adminQuizNameUpdate(session2.token, validQuizId.quizId, newvalidQuizName);
    }
    expect(adminQuizNameUpdateFunc).toThrow(ApiError);
    expect(adminQuizNameUpdateFunc).toThrow('Quiz ID not owned by this user');
  });
  test('Name contains invalid characters', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizNameUpdateFunc() {
      adminQuizNameUpdate(session.token, validQuizId.quizId, invalidQuizName);
    }
    expect(adminQuizNameUpdateFunc).toThrow(ApiError);
    expect(adminQuizNameUpdateFunc).toThrow('Name cannot contain special characters');
  });
  test('invalid Name length - too long', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizNameUpdateFunc() {
      adminQuizNameUpdate(session.token, validQuizId.quizId, longQuizName);
    }
    expect(adminQuizNameUpdateFunc).toThrow(ApiError);
    expect(adminQuizNameUpdateFunc).toThrow('Invalid name length');
  });
  test('invalid Name length - too short', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizNameUpdateFunc() {
      adminQuizNameUpdate(session.token, validQuizId.quizId, shortQuizName);
    }
    expect(adminQuizNameUpdateFunc).toThrow(ApiError);
    expect(adminQuizNameUpdateFunc).toThrow('Invalid name length');
  });
  test('Name already in use', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    const NameAlreadyExists = validQuizName;
    function adminQuizNameUpdateFunc() {
      adminQuizNameUpdate(session.token, validQuizId.quizId, NameAlreadyExists);
    }
    expect(adminQuizNameUpdateFunc).toThrow(ApiError);
    expect(adminQuizNameUpdateFunc).toThrow('Quiz name already exists');
  });
});

// adminQuizDescriptionUpdate tests
describe('adminQuizDescriptionUpdate - Success Cases', () => {
  test('valid authUserId, quizId and description', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    expect(adminQuizDescriptionUpdate(session.token, validQuizId.quizId, newvalidQuizDescription)).toStrictEqual({});
  });
});

describe('adminQuizDescriptionUpdate - Error Cases', () => {
  test('invalid token', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizDescriptionUpdateFunc() {
      adminQuizDescriptionUpdate(session.token + 100, validQuizId.quizId, newvalidQuizDescription);
    }
    expect(adminQuizDescriptionUpdateFunc).toThrow(ApiError);
    expect(adminQuizDescriptionUpdateFunc).toThrow('Invalid token');
  });
  test('invalid QuizId', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizDescriptionUpdateFunc() {
      adminQuizDescriptionUpdate(session.token, validQuizId.quizId + 100, newvalidQuizDescription);
    }
    expect(adminQuizDescriptionUpdateFunc).toThrow(ApiError);
    expect(adminQuizDescriptionUpdateFunc).toThrow('Invalid quiz ID');
  });
  test('QuizId not owned by this user', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizDescriptionUpdateFunc() {
      adminQuizDescriptionUpdate(session2.token, validQuizId.quizId, newvalidQuizDescription);
    }
    expect(adminQuizDescriptionUpdateFunc).toThrow(ApiError);
    expect(adminQuizDescriptionUpdateFunc).toThrow('Quiz ID not owned by this user');
  });
  test('Description is longer than 100 characters', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    function adminQuizDescriptionUpdateFunc() {
      adminQuizDescriptionUpdate(session.token, validQuizId.quizId, longQuizDescription);
    }
    expect(adminQuizDescriptionUpdateFunc).toThrow(ApiError);
    expect(adminQuizDescriptionUpdateFunc).toThrow('Quiz Description more than 100 characters in length');
  });
});
