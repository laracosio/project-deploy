import { assert } from 'console';
import { getData } from '../dataStore';
import { person1, person2, person3, validQuizDescription, validQuizName } from '../testingData';
import { authLoginRequest, authUserDetailsRequest, clearRequest, authRegisterRequest, quizCreateRequest } from './serverTestHelper';

beforeEach(() => {
  clearRequest();
});

describe('adminAuthRegister Server - Success', () => {
  test('success - one user', () => {
    const res = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ token: expect.any(String) });
  });
  test('success - two users', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const res = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ token: expect.any(String) });
  });
  test('success - three users', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const p3 = authRegisterRequest(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const person3data = JSON.parse(p3.body.toString());
    expect(person3data).toStrictEqual({ token: expect.any(String) });
    const quiz1 = quizCreateRequest(person3data.token, validQuizName, validQuizDescription);
    const quiz1data = JSON.parse(quiz1.body.toString());
    expect(quiz1data).toStrictEqual({ quizId: expect.any(Number) });
  });
});

describe('adminAuthRegister Server - error', () => {
  test('error - Email address is used by another user', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const res = authRegisterRequest(person1.email, person2.password, person2.nameFirst, person2.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(400);
  });
  test('error - invalid email', () => {
    const res = authRegisterRequest('h.simpson@@springfield.com', person1.password, person1.nameFirst, person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(400);
  });
  test('error - invalid nameFirst Characters', () => {
    const res = authRegisterRequest(person1.email, person1.password, 'H0mer', person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(400);
  });
  test('error - first name too short', () => {
    const res = authRegisterRequest(person1.email, person1.password, 'H', person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(400);
  });
  test('error - first name too long', () => {
    const res = authRegisterRequest(person1.email, person1.password, 'HomerHasAVeryLongName', person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(400);
  });
  test('error - last name too short', () => {
    const res = authRegisterRequest(person1.email, person1.password, person1.nameFirst, 'S');
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(400);
  });
  test('error - last name too long', () => {
    const res = authRegisterRequest(person1.email, person1.password, person1.nameFirst, 'HomerHasAVeryLongName');
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(400);
  });
  test('error - password too short', () => {
    const res = authRegisterRequest(person1.email, 'A234567', person1.nameFirst, person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(400);
  });
  test('error - password all letters', () => {
    const res = authRegisterRequest(person1.email, 'ABCDEFGH', person1.nameFirst, person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(400);
  });
  test('error - password all numbers', () => {
    const res = authRegisterRequest(person1.email, '12345678', person1.nameFirst, person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(400);
  });
});

describe('adminAuthLogin - Successful Route', () => {
  test('adminAuthLogin - Successful Route', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const resLogin = authLoginRequest(person1.email, person1.password);
    const data = JSON.parse(resLogin.body.toString());
    expect(data).toStrictEqual({ token: expect.any(String) });
  });
});

describe('adminAuthLogin - Unsuccessful Route', () => {
  test('Unsuccessful Root (400): Email address does not exist', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const resLogin = authLoginRequest(person2.email, person1.password);
    const data = JSON.parse(resLogin.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Unsuccessful Root (400): Password is not correct for the given email', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const resLogin = authLoginRequest(person1.email, person2.password);
    const data = JSON.parse(resLogin.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe('adminAuthDetails - Successful Root', () => {
  test('adminAuthDetails - Successful Root', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const resLogin = authLoginRequest(person1.email, person1.password);
    const token = JSON.parse(resLogin.body.toString());
    const resDetails = authUserDetailsRequest(token.token);
    const data = JSON.parse(resDetails.body.toString());
    expect(data).toStrictEqual(
      {
        user:
        {
          userId: person1.userId,
          name: person1.nameFirst + ' ' + person1.nameLast,
          email: person1.email,
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0,
        }
      });
  });
});

describe('adminAuthDetails - Unsuccessful Route', () => {
  test('Unsuccessful Route (401): Token is empty', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    authLoginRequest(person1.email, person1.password);
    const token = '';
    const resDetails = authUserDetailsRequest(token);
    const data = JSON.parse(resDetails.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Unsuccessful Route (401): Token is invalid', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    authLoginRequest(person1.email, person1.password);
    const token = 'lkgjlaksjglaksjgla';
    const resDetails = authUserDetailsRequest(token);
    const data = JSON.parse(resDetails.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe('POST /v1/admin/auth/logout - Error Cases', () => {
  test('Invalid token', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    authLoginRequest(person1.email, person1.password);
    const response = authLogoutRequest(userData.token + 1);
    expect(response.statusCode).toStrictEqual(401);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid token' });
  });
});

describe('POST /v1/admin/auth/logout - Success Cases', () => {
  test('Token was successfully removed from dataStore', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = authLogoutRequest(userData.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});
    const dataStore = getData();
    console.assert(dataStore.tokens.find(user => user.sessionId === userData.token), 'error: token was not removed after userLogout');
  })
});
