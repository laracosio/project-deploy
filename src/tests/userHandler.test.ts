import { person1 } from '../testingData';
import { authLoginRequest, authUserDetailsRequest, clearRequest, authRegisterRequest } from './serverTestHelper';

beforeEach(() => {
  clearRequest();
});

describe('adminAuthDetails - Successful Route', () => {
  test('adminAuthDetails - Successful Route', () => {
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
