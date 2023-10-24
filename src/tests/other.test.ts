import { adminAuthRegister, adminAuthLogin } from '../features/auth';
import { adminQuizCreate } from '../features/quiz';
import { adminQuizRemove } from '../features/trash';
import { person1, person2 } from '../testingData';
import { clear, tokenValidation } from '../features/other';
import { ApiError } from '../errors/ApiError';

describe('clear - Success Cases', () => {
  test('clear - user', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    expect(clear()).toStrictEqual({});
  });
  test('clear - user and quiz', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const quiz1 = adminQuizCreate(session.token, 'Misc Quiz Name', 'Misc Description');
    expect(clear()).toStrictEqual({});

    function adminQuizRemoveFunc() {
      adminQuizRemove(session.token, quiz1.quizId);
    }
    expect(adminQuizRemoveFunc).toThrow(ApiError);
    expect(adminQuizRemoveFunc).toThrow('Invalid quizId');
  });
  test('clear - multiple users and quizzes', () => {
    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminQuizCreate(session.token, 'Misc Quiz Name', 'Misc Description');
    adminQuizCreate(session.token, 'Misc Quiz Name2', 'Misc Description2');
    expect(clear()).toStrictEqual({});

    function adminAuthLoginFunc() {
      adminAuthLogin(person1.email, person1.password);
    }
    expect(adminAuthLoginFunc).toThrow(ApiError);
    expect(adminAuthLoginFunc).toThrow('email does not belong to a user');
  });
});

describe('tokenValidation - Success Cases', () => {
  test('tokenValidation', () => {
    const token1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    expect(tokenValidation(token1.token)).toStrictEqual(true);
    expect(tokenValidation('fkalkgla')).toStrictEqual(false);
    expect(tokenValidation(null)).toStrictEqual(false);
  });
});
