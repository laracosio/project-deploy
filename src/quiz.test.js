// functions to import
import { adminAuthRegister } from './auth.js';
import { person1, person2 } from './testingData.js';
import { clear } from './other.js';

const ERROR = { error: expect.any(String)};

// Any test resets
beforeEach(() => {
  clear();
});

// tests for adminQuizRemove
describe('adminQuizRemove - Success Cases', () => {
  test('1 quiz created - 1 removed', () => {
    const personId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quizId = adminQuizCreate(personId, 'Misc Quiz Name', 'Misc Quiz Description');
    expect.adminQuizRemove(personId, quizId).toBe({});
  })
  test('2 quiz created - 1 removed', () => {
    const personId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quizId = adminQuizCreate(personId, 'Misc Quiz Name', 'Misc Quiz Description');
    const quizId2 = adminQuizCreate(personId, 'Misc Quiz Name2', 'Misc Quiz Description2');
    expect.adminQuizRemove(personId, quizId2).toBe({});
  })
})

describe('adminQuizRemove - Error Cases', () => {
  test('invalid authUserId', () => {
    const personId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quizId = adminQuizCreate(personId, 'Misc Quiz Name', 'Misc Quiz Description');
    expect.adminQuizRemove(2, quizId).toStrictEqual({ ERROR });
  })
  test('invalid quizId', () => {
    const personId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quizId = adminQuizCreate(personId, 'Misc Quiz Name', 'Misc Quiz Description');
    expect.adminQuizRemove(personId, 2).toStrictEqual({ ERROR });
  })
  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const personId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const diffId = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const quizId = adminQuizCreate(personId, 'Misc Quiz Name', 'Misc Quiz Description');
    expect.adminQuizRemove(diffId, quizId).toStrictEqual({ ERROR });
  })
})