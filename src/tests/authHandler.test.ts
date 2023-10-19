import { person1, person2, person3, person4, person5, person6, person7 } from '../testingData';

import request from 'sync-request-curl';
import { port, url } from '../config.json';
const SERVER_URL = `${url}:${port}`;


import { person1, person2, person3, validQuizDescription, validQuizName } from '../testingData';
import { clearRequest, authRegisterRequest, quizCreateRequest } from './serverTestHelper';

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


//server tests for adminAuthLogin
describe('adminAuthLogin - Successful Root', () => {
  // Not necessary, since it's empty, though reminder that
  // GET/DELETE is `qs`, PUT/POST is `json`
  test('adminAuthLogin - Successful Root', () => {
    const validEmail = person1.email;
    const validPassword = person1.password;
    const validNameFirst = person1.nameFirst;
    const validNameLast = person1.nameLast;

    const resRegister = request(
      'POST',
      SERVER_URL + '/v1/admin/auth/register',
      {
        json: {
          validEmail,
          validPassword,
          validNameFirst,
          validNameLast,
        }
      }
    )

    const resLogin = request(
      'POST',
      SERVER_URL + '/v1/admin/auth/login',

      // Not necessary, since it's empty, though reminder that
      // GET/DELETE is `qs`, PUT/POST is `json`
      {
        json: {
          validEmail,
          validPassword,
        }
      }
    );
    
    //expect(resLogin.statusCode).toStrictEqual(200);

    const data = JSON.parse(resLogin.body.toString());
    console.log('This is the response: ', data);
    expect(data).toStrictEqual({ token: expect.any(String) });
  });
});

describe('adminAuthLogin - Unsuccessful Root', () => {
  // Not necessary, since it's empty, though reminder that
  // GET/DELETE is `qs`, PUT/POST is `json`
  test('Unsuccessful Root (400): Email address does not exist', () => {
    const validEmail = person1.email; 
    const validPassword = person1.password;
    const validNameFirst = person1.nameFirst;
    const validNameLast = person1.nameLast;
    const invalidEmail = person2.email;

    //adminAuthRegister request
    request(
      'POST',
      SERVER_URL + '/v1/admin/auth/register',
      {
        json: {
          validEmail,
          validPassword,
          validNameFirst,
          validNameLast,
        }
      }
    )

    const resLogin = request(
      'POST',
      SERVER_URL + '/v1/admin/auth/login',

      // Not necessary, since it's empty, though reminder that
      // GET/DELETE is `qs`, PUT/POST is `json`
      {
        json: {
          invalidEmail,
          validPassword,
        }
      }
    );

    expect(resLogin.statusCode).toStrictEqual(400);

    const data = JSON.parse(resLogin.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Unsuccessful Root (400): Password is not correct for the given email', () => {
    const validEmail = person1.email;
    const validPassword = person1.password;
    const validNameFirst = person1.nameFirst;
    const validNameLast = person1.nameLast;
    const invalidPassword = person2.password;
    
    //adminAuthRegister request
    request(
      'POST',
      SERVER_URL + '/v1/admin/auth/register',
      {
        json: {
          validEmail,
          validPassword,
          validNameFirst,
          validNameLast,
        }
      }
    )

    const resLogin = request(
      'POST',
      SERVER_URL + '/v1/admin/auth/login',

      // Not necessary, since it's empty, though reminder that
      // GET/DELETE is `qs`, PUT/POST is `json`
      {
        json: {
          validEmail,
          invalidPassword,
        }
      }
    );

    expect(resLogin.statusCode).toStrictEqual(400);

    const data = JSON.parse(resLogin.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

//server tests for adminAuthDetails
describe('adminAuthDetails - Successful Root', () => {
  // Not necessary, since it's empty, though reminder that
  // GET/DELETE is `qs`, PUT/POST is `json`
  test('adminAuthDetails - Successful Root', () => {
    const validEmail = person1.email;
    const validPassword = person1.password;
    const validNameFirst = person1.nameFirst;
    const validNameLast = person1.nameLast;

    //register
    request(
      'POST',
      SERVER_URL + '/v1/admin/auth/register',
      {
        json: {
          validEmail,
          validPassword,
          validNameFirst,
          validNameLast,
        }
      }
    )
    
    //login
    const resLogin = request(
      'POST',
      SERVER_URL + '/v1/admin/auth/login',
      {
        json: {
          validEmail,
          validPassword,
        }
      }
    );

    const token = JSON.parse(resLogin.body.toString());

    const resDetails = request(
      'GET',
      SERVER_URL + '/v1/admin/auth/details',
      {
        qs: {
          token,
        }
      }
    );

    expect(resDetails.statusCode).toStrictEqual(200);
    const data = JSON.parse(resDetails.body.toString());
    expect(data).toStrictEqual({ token: expect.any(String) });
  });
});

describe('adminAuthDetails - Unsuccessful Root', () => {
  // Not necessary, since it's empty, though reminder that
  // GET/DELETE is `qs`, PUT/POST is `json`
  test('Unsuccessful Root (401): Token is empty', () => {
    const validEmail = person1.email;
    const validPassword = person1.password;
    const validNameFirst = person1.nameFirst;
    const validNameLast = person1.nameLast;

    //register
    request(
      'POST',
      SERVER_URL + '/v1/admin/auth/register',
      {
        json: {
          validEmail,
          validPassword,
          validNameFirst,
          validNameLast,
        }
      }
    )
    
    //login
    const resLogin = request(
      'POST',
      SERVER_URL + '/v1/admin/auth/login',
      {
        json: {
          validEmail,
          validPassword,
        }
      }
    );

    const token = '';

    const resDetails = request(
      'GET',
      SERVER_URL + '/v1/admin/auth/details',
      {
        qs: {
          token,
        }
      }
    );

    expect(resDetails.statusCode).toStrictEqual(401);

    const data = JSON.parse(resDetails.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Unsuccessful Root (401): Token is invalid', () => {
    const validEmail = person1.email;
    const validPassword = person1.password;
    const validNameFirst = person1.nameFirst;
    const validNameLast = person1.nameLast;

    //register
    request(
      'POST',
      SERVER_URL + '/v1/admin/auth/register',
      {
        json: {
          validEmail,
          validPassword,
          validNameFirst,
          validNameLast,
        }
      }
    )
    
    //login
    const resLogin = request(
      'POST',
      SERVER_URL + '/v1/admin/auth/login',
      {
        json: {
          validEmail,
          validPassword,
        }
      }
    );

    const token = 'lkgjlaksjglaksjgla';

    const resDetails = request(
      'GET',
      SERVER_URL + '/v1/admin/auth/details',
      {
        qs: {
          token,
        }
      }
    );

    expect(resDetails.statusCode).toStrictEqual(401);

    const data = JSON.parse(resDetails.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});