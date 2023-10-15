import { adminAuthRegister, adminAuthLogin } from './auth';
import { adminQuizCreate, adminQuizRemove } from './quiz';
import { person1, person2 } from './testingData.js';
import { clear } from './other';

const ERROR = { error: expect.any(String)};

describe('clear - Success Cases', () => {
  test('clear - user', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    expect(clear()).toStrictEqual({});
  })
  test('clear - user and quiz', () => {
    let user1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    let quiz1 = adminQuizCreate(user1.authUserId, 'Misc Quiz Name', 'Misc Description');
    expect(clear()).toStrictEqual({});
    expect(adminQuizRemove(user1.authUserId, quiz1.quizId)).toEqual(ERROR);
  })
  test('clear - multiple users and quizzes', () => {
    let user1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    let quiz1 = adminQuizCreate(user1.authUserId, 'Misc Quiz Name', 'Misc Description');
    adminQuizCreate(2, 'Misc Quiz Name2', 'Misc Description2');
    expect(clear()).toStrictEqual({});
    expect(adminAuthLogin(person1.email, person1.password)).toEqual(ERROR);
  })
})