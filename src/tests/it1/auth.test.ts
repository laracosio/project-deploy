// functions/data to import
import { person1, person2, person3, person4, person5, person6, person7 } from '../../testingData';
import { adminAuthRegister, adminAuthLogin } from '../../services/authService';
import { clear } from '../../services/otherService';
import { ApiError } from '../../errors/ApiError';

const TOKEN = { token: expect.any(String) };

// Any test resets
beforeEach(() => {
  clear();
});

// tests for adminAuthRegister
describe('adminAuthRegister - Success Cases', () => {
  test('1 user', () => {
    expect(adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast)).toMatchObject(TOKEN);
  });
  test('2 users', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    expect(adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast)).toMatchObject(TOKEN);
  });
  test('7 users', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
    adminAuthRegister(person5.email, person5.password, person5.nameFirst, person5.nameLast);
    adminAuthRegister(person6.email, person6.password, person6.nameFirst, person6.nameLast);
    expect(adminAuthRegister(person7.email, person7.password, person7.nameFirst, person7.nameLast)).toMatchObject(TOKEN);
  });
});

describe('adminAuthRegister - Error Cases', () => {
  test('email address - duplicate', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    function adminAuthRegisterFunc() {
      adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    }
    expect(adminAuthRegisterFunc).toThrow(ApiError);
    expect(adminAuthRegisterFunc).toThrow('Invalid registration details');
  });
  test('email address - invalid', () => {
    function adminAuthRegisterFunc() {
      adminAuthRegister('h.simpson@@springfield.com', person1.password, person1.nameFirst, person1.nameLast);
    }
    expect(adminAuthRegisterFunc).toThrow(ApiError);
    expect(adminAuthRegisterFunc).toThrow('Invalid registration details');
  });
  test('first name - invalid characters', () => {
    function adminAuthRegisterFunc() {
      adminAuthRegister(person1.email, person1.password, 'H0mer', person1.nameLast);
    }
    expect(adminAuthRegisterFunc).toThrow(ApiError);
    expect(adminAuthRegisterFunc).toThrow('Invalid registration details');
  });
  test('first name - too short', () => {
    function adminAuthRegisterFunc() {
      adminAuthRegister(person1.email, person1.password, 'H', person1.nameLast);
    }
    expect(adminAuthRegisterFunc).toThrow(ApiError);
    expect(adminAuthRegisterFunc).toThrow('Invalid registration details');
  });
  test('first name - too long', () => {
    function adminAuthRegisterFunc() {
      adminAuthRegister(person1.email, person1.password, 'HomerHasAVeryLongName', person1.nameLast);
    }
    expect(adminAuthRegisterFunc).toThrow(ApiError);
    expect(adminAuthRegisterFunc).toThrow('Invalid registration details');
  });
  test('last name - invalid characters', () => {
    function adminAuthRegisterFunc() {
      adminAuthRegister(person1.email, person1.password, person1.nameFirst, '$!MP$0N');
    }
    expect(adminAuthRegisterFunc).toThrow(ApiError);
    expect(adminAuthRegisterFunc).toThrow('Invalid registration details');
  });
  test('last name - too short', () => {
    function adminAuthRegisterFunc() {
      adminAuthRegister(person1.email, person1.password, person1.nameFirst, 'S');
    }
    expect(adminAuthRegisterFunc).toThrow(ApiError);
    expect(adminAuthRegisterFunc).toThrow('Invalid registration details');
  });
  test('last name - too long', () => {
    function adminAuthRegisterFunc() {
      adminAuthRegister(person1.email, person1.password, person1.nameFirst, 'SimpsonSimpsonSimpson');
    }
    expect(adminAuthRegisterFunc).toThrow(ApiError);
    expect(adminAuthRegisterFunc).toThrow('Invalid registration details');
  });
  test('password - too short', () => {
    function adminAuthRegisterFunc() {
      adminAuthRegister(person1.email, 'a1', person1.nameFirst, person1.nameLast);
    }
    expect(adminAuthRegisterFunc).toThrow(ApiError);
    expect(adminAuthRegisterFunc).toThrow('Invalid registration details');
  });
  test('password - all letters', () => {
    function adminAuthRegisterFunc() {
      adminAuthRegister(person1.email, 'ABCDEFGH', person1.nameFirst, person1.nameLast);
    }
    expect(adminAuthRegisterFunc).toThrow(ApiError);
    expect(adminAuthRegisterFunc).toThrow('Invalid registration details');
  });
  test('password - all numbers', () => {
    function adminAuthRegisterFunc() {
      adminAuthRegister(person1.email, '12345678', person1.nameFirst, person1.nameLast);
    }
    expect(adminAuthRegisterFunc).toThrow(ApiError);
    expect(adminAuthRegisterFunc).toThrow('Invalid registration details');
  });
});

// tests for adminAuthLogin
describe('Testing adminAuthLogin', () => {
  test('Return token if email and password are both correct', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
    expect(adminAuthLogin(person1.email, person1.password)).toStrictEqual(TOKEN);
    expect(adminAuthLogin(person2.email, person2.password)).toStrictEqual(TOKEN);
    expect(adminAuthLogin(person3.email, person3.password)).toStrictEqual(TOKEN);
    expect(adminAuthLogin(person4.email, person4.password)).toStrictEqual(TOKEN);
  });
  test('Return error when email does not belong to a user', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
    function adminAuthLoginFunc() {
      adminAuthLogin(person5.email, person5.password);
    }
    expect(adminAuthLoginFunc).toThrow(ApiError);
    expect(adminAuthLoginFunc).toThrow('email does not belong to a user');
  });
  test('Return error when password is not correct', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
    function adminAuthLoginFunc() {
      adminAuthLogin(person1.email, person4.password);
    }
    expect(adminAuthLoginFunc).toThrow(ApiError);
    expect(adminAuthLoginFunc).toThrow('password is incorrect');
  });
});
