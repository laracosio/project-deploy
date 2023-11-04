import { person1, person2, person3, person4 } from '../../testingData';
import { adminAuthRegister, adminAuthLogin } from '../../features/auth';
import { clear } from '../../features/other';
import { adminUserDetails } from '../../features/user';
import { ApiError } from '../../errors/ApiError';

beforeEach(() => {
  clear();
});

// tests for authUserDetails
describe('Testing adminAuthDetails', () => {
  test('Return token if email and password are both correct', () => {
    const user1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const user4 = adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);

    // two failed attempts
    expect(() => {
      adminAuthLogin(person1.email, person2.password);
    }).toThrow('password is incorrect');
    expect(() => {
      adminAuthLogin(person1.email, person4.password);
    }).toThrow('password is incorrect');

    expect(adminUserDetails(user1.token)).toEqual({
      user:
      {
        userId: person1.userId,
        name: person1.nameFirst + ' ' + person1.nameLast,
        email: person1.email,
        numSuccessfulLogins: person1.numSuccessfulLogins,
        numFailedPasswordsSinceLastLogin: person1.numFailedPasswordsSinceLastLogin,
      }
    });
    expect(adminUserDetails(user4.token)).toEqual({
      user:
      {
        userId: person4.userId,
        name: person4.nameFirst + ' ' + person4.nameLast,
        email: person4.email,
        numSuccessfulLogins: person4.numSuccessfulLogins,
        numFailedPasswordsSinceLastLogin: person4.numFailedPasswordsSinceLastLogin,
      }
    });
  });
});

describe('Testing adminAuthDetails', () => {
  test('Return error if token is invalid', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    // adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    // adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const invalidUser = { token: '32589invalid2582' };
    // adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
    function adminAuthDetailsFunc() {
      adminUserDetails(invalidUser.token);
    }
    expect(adminAuthDetailsFunc).toThrow(ApiError);
    expect(adminAuthDetailsFunc).toThrow('Token is invalid');
  });
});
