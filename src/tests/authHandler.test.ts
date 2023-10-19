import request from 'sync-request-curl';
import { port, url } from '../config.json';
const SERVER_URL = `${url}:${port}`;
import { person1, person2, person3 } from '../testingData';

const registerRequest = (email: string, password: string, nameFirst: string, nameLast: string) => {
  return request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
      body: JSON.stringify({
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast
      }),
      headers: {
        'Content-type': 'application/json',
      },
    }
  );
};

const clearRequest = () => {
  request(
    'DELETE',
    SERVER_URL + '/clear'
  );
}

describe('adminAuthRegister Server - Success', () => {
  beforeEach(() => {
    clearRequest;
  });
  test('success - one user', () => {
    const res = registerRequest(person1.email, person1.password,
                                person1.nameFirst, person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ token: expect.any(Number)});
  });
  test('success - two users', () => {
    registerRequest(person1.email, person1.password,
                    person1.nameFirst, person1.nameLast);
    const res = registerRequest(person2.email, person2.password,
                                person2.nameFirst, person2.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ token: expect.any(Number)});
  });
  test('success - three users', () => {
    registerRequest(person1.email, person1.password,
                    person1.nameFirst, person1.nameLast);
    registerRequest(person2.email, person2.password,
                    person2.nameFirst, person2.nameLast);
    const res = registerRequest(person3.email, person3.password,
                                person3.nameFirst, person3.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ token: expect.any(Number)});
  });
});

describe('adminAuthRegister Server - error', () => {
  beforeEach(() => {
    clearRequest;
  });
  test('error - Email address is used by another user', () => {
    registerRequest(person1.email, person1.password,
                    person1.nameFirst, person1.nameLast);
    const res = registerRequest(person1.email, person2.password,
                                person2.nameFirst, person2.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(data.status).toBe(400);
  })
  test('error - invalid email', () => {
    const res = registerRequest('h.simpson@@springfield.com', person1.password,
                                 person1.nameFirst, person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(data.status).toBe(400);
  });
  test('error - invalid nameFirst Characters', () => {
    const res = registerRequest(person1.email, person1.password,
                                'H0mer', person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(data.status).toBe(400);
  });
  test('error - first name too short', () => {
    const res = registerRequest(person1.email, person1.password,
                                'H', person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(data.status).toBe(400);
  });
  test('error - first name too long', () => {
    const res = registerRequest(person1.email, person1.password,
                                'HomerHasAVeryLongName', person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(data.status).toBe(400);
  });
  test('error - last name too short', () => {
    const res = registerRequest(person1.email, person1.password,
                                person1.nameFirst, 'S');
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(data.status).toBe(400);
  });
  test('error - last name too long', () => {
    const res = registerRequest(person1.email, person1.password,
                                person1.nameFirst, 'HomerHasAVeryLongName');
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(data.status).toBe(400);
  });
  test('error - password too short', () => {
    const res = registerRequest(person1.email,'A234567',
                                person1.nameFirst, person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(data.status).toBe(400);
  });
  test('error - password all letters', () => {
    const res = registerRequest(person1.email,'ABCDEFGH',
                                person1.nameFirst, person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(data.status).toBe(400);
  });
  test('error - password all numbers', () => {
    const res = registerRequest(person1.email,'12345678',
                                person1.nameFirst, person1.nameLast);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(data.status).toBe(400);
  });
});