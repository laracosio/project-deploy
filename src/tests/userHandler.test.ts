import { person1, person2, person3, person4 } from '../testingData';
import { authLoginRequest, authUserDetailsRequest, clearRequest, authRegisterRequest, userUpdateDetailsResponse, userUpdatePasswordRequest } from './serverTestHelper';

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

// tests cases for adminUserUpdateDetails
describe('PUT /v1/admin/user/details - Error Cases', () => {
  test('Email is currently used by another user (excluding the current user)', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const response = userUpdateDetailsResponse(userData.token, person2.email, person1.nameFirst, person1.nameLast);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Email is currently used by another user' });
  });
  test('Email does not satisfy: (validator.isEmail)', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, 'h.simpson@@springfield.com', person1.nameFirst, person1.nameLast);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid email' });
  });
  test('NameFirst contains characters other than lowercase, uppercase, spaces, hyphens, or apostrophes - numbers', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, person1.email, 'St3v3', person1.nameLast);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Name must only contain lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' });
  });
  test('NameFirst contains characters other than lowercase, uppercase, spaces, hyphens, or apostrophes - special', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, person1.email, 'B@rry', person1.nameLast);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Name must only contain lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' });
  });
  test('NameFirst is less than 2 characters or more than 20 characters - less', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, person1.email, 'a', person1.nameLast);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Name must be between 2 and 20 characters' });
  });
  test('NameFirst is less than 2 characters or more than 20 characters - more', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, person1.email, 'Thisnameismorethan20ch', person1.nameLast);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Name must be between 2 and 20 characters' });
  });
  test('NameLast contains characters other than lowercase, uppercase, spaces, hyphens, or apostrophes - numbers', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, person1.email, person1.nameFirst, 'St3v3');
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Name must only contain lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' });
  });
  test('NameLast contains characters other than lowercase, uppercase, spaces, hyphens, or apostrophes - special', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, person1.email, person1.nameFirst, 'B@rry');
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Name must only contain lowercase letters, uppercase letters, spaces, hyphens, or apostrophes' });
  });
  test('NameLast is less than 2 characters or more than 20 characters - less', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, person1.email, person1.nameFirst, 'a');
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Name must be between 2 and 20 characters' });
  });
  test('NameLast is less than 2 characters or more than 20 characters - more', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, person1.email, person1.nameFirst, 'Thisnameismorethan20ch');
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Name must be between 2 and 20 characters' });
  });
  test('Invalid token', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token + 1, person1.email, person1.nameFirst, person1.nameLast);
    expect(response.statusCode).toStrictEqual(401);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid token' });
  });
});

describe('PUT /v1/admin/user/details - Success Cases', () => {
  test('email updated', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, person2.email, person1.nameFirst, person1.nameLast);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});
  });
  test('nameFirst updated', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, person1.email, 'Homes', person1.nameLast);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});
  });
  test('nameLast updated', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdateDetailsResponse(userData.token, person1.email, person1.nameFirst, 'Simps');
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});
  });
});

// tests for user/password
describe('PUT /v1/admin/user/password - Error Cases', () => {
  test('Old Password is not the correct old password', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdatePasswordRequest(userData.token, `${person1.password}m`, 'd1sn3yl4nd');
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Old Password is incorrect' });
  });
  test('New Password = Old Password', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdatePasswordRequest(userData.token, person1.password, person1.password);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'New Password cannot be the same as old password' });
  });
  test('New Password has already been used before by this user', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    userUpdatePasswordRequest(userData.token, person1.password, person2.password);
    userUpdatePasswordRequest(userData.token, person2.password, person3.password);
    userUpdatePasswordRequest(userData.token, person3.password, person4.password);
    const response = userUpdatePasswordRequest(userData.token, person4.password, person2.password);
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'New Password cannot be the same as old password' });
  });
  test('New Password is less than 8 characters', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdatePasswordRequest(userData.token, person1.password, 'disney7');
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Password must be at least 8 characters' });
  });
  test('New Password does not contain at least one number and at least one letter - all letters', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdatePasswordRequest(userData.token, person1.password, 'disneyland');
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Password must contain at least one number and at least one letter' });
  });
  test('New Password does not contain at least one number and at least one letter - all numbers', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdatePasswordRequest(userData.token, person1.password, '12345678');
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Password must contain at least one number and at least one letter' });
  });
  test('New Password does not contain at least one number and at least one letter - all special', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdatePasswordRequest(userData.token, person1.password, '!@#$%^&*');
    expect(response.statusCode).toStrictEqual(400);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Password must contain at least one number and at least one letter' });
  });
  test('Invalid token', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdatePasswordRequest(userData.token + 1, person1.password, 'd1sn3yl4nd');
    expect(response.statusCode).toStrictEqual(401);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid token' });
  });
});

describe('PUT /v1/admin/user/password - Passed Cases', () => {
  test('valid inputs', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const response = userUpdatePasswordRequest(userData.token, person1.password, person2.password);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});
  });
});
