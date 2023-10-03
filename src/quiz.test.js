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
    const person = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(person.authUserId, 'Misc Quiz Name', 'Misc Quiz Description');
    expect.adminQuizRemove(person.authUserId, quiz.quizId).toBe({});
  })
  test('2 quiz created - 1 removed', () => {
    const person = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(person.authUserId, 'Misc Quiz Name', 'Misc Quiz Description');
    const quiz2 = adminQuizCreate(person.authUserId, 'Misc Quiz Name2', 'Misc Quiz Description2');
    expect.adminQuizRemove(person.authUserId, quiz2.quizId).toBe({});
  })
})

describe('adminQuizRemove - Error Cases', () => {
  test('invalid authUser', () => {
    const person = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(person.authUserId, 'Misc Quiz Name', 'Misc Quiz Description');
    expect.adminQuizRemove(person.authUserId + 1, quiz.quizId).toStrictEqual({ ERROR });
  })
  test('invalid quiz', () => {
    const person = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(person.authUserId, 'Misc Quiz Name', 'Misc Quiz Description');
    expect.adminQuizRemove(person.authUserId, quiz.quizId + 1).toStrictEqual({ ERROR });
  })
  test('Quiz  does not refer to a quiz that this user owns', () => {
    const person = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const person2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const quiz = adminQuizCreate(person.authUserId, 'Misc Quiz Name', 'Misc Quiz Description');
    expect.adminQuizRemove(person2.authUserId, quiz.quizId).toStrictEqual({ ERROR });
  })
})