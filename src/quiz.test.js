// functions to import
import { adminAuthRegister } from './auth.js';
import { person1, person2 } from './testingData.js';
import { adminQuizCreate, adminQuizRemove } from './quiz.js'
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
    expect(adminQuizRemove(person.authUserId, quiz.quizId)).toStrictEqual({});
  })
  test('2 quiz created - 1 removed', () => {
    const person = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(person.authUserId, 'Misc Quiz Name', 'Misc Quiz Description');
    const quiz2 = adminQuizCreate(person.authUserId, 'Misc Quiz Name2', 'Misc Quiz Description2');
    expect(adminQuizRemove(person.authUserId, quiz2.quizId)).toStrictEqual({});
  })
  test('multiple quizzes create, multiple quizzes removed', () => {
    const person = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personB = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const quiz = adminQuizCreate(person.authUserId, 'Quiz1', 'Misc Quiz Description');
    const quiz2 = adminQuizCreate(person.authUserId, 'Quiz2', 'Misc Quiz Description2');
    const quiz3 = adminQuizCreate(person.authUserId, 'Quiz3', 'Misc Quiz Description3');
    const quiz4 = adminQuizCreate(person.authUserId, 'Quiz4', 'Misc Quiz Description4');
    const quiz5 = adminQuizCreate(personB.authUserId, 'Quiz5', 'Misc Quiz Description5');
    const quiz6 = adminQuizCreate(personB.authUserId, 'Quiz6', 'Misc Quiz Description6');
    const quiz7 = adminQuizCreate(personB.authUserId, 'Quiz7', 'Misc Quiz Description7');
    const quiz8 = adminQuizCreate(personB.authUserId, 'Quiz8', 'Misc Quiz Description8');
    expect(adminQuizRemove(personB.authUserId, quiz7.quizId)).toStrictEqual({});
    expect(adminQuizRemove(person.authUserId, quiz4.quizId)).toStrictEqual({});
    expect(adminQuizRemove(personB.authUserId, quiz5.quizId)).toStrictEqual({});
    expect(adminQuizRemove(person.authUserId, quiz2.quizId)).toStrictEqual({});
  })
})

describe('adminQuizRemove - Error Cases', () => {
  test('invalid authUser', () => {
    const person = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(person.authUserId, 'Misc Quiz Name', 'Misc Quiz Description');
    expect(adminQuizRemove(person.authUserId + 1, quiz.quizId)).toStrictEqual(ERROR);
  })
  test('invalid quiz', () => {
    const person = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz = adminQuizCreate(person.authUserId, 'Misc Quiz Name', 'Misc Quiz Description');
    expect(adminQuizRemove(person.authUserId, quiz.quizId + 1)).toStrictEqual(ERROR);
  })
  test('Quiz  does not refer to a quiz that this user owns', () => {
    const person = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personB = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const quiz = adminQuizCreate(person.authUserId, 'Misc Quiz Name', 'Misc Quiz Description');
    expect(adminQuizRemove(personB.authUserId, quiz.quizId)).toStrictEqual(ERROR);
  })
})