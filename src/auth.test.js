// functions to import
//e.g. import { clear, movieAdd, movieEdit, moviesList } from './movie';


import { adminAuthLogin, adminAuthDetails } from './auth.js';
import { setData } from './dataStore.js';
// Any test resets


/** test template
 * describe('testGroupName', () => {
 *  test('nameOfIndividualTest', () => {
 *   TESTCODE_GOES_HERE
 *  expect(WHAT_YOU_EXPECT_TO_BE_RETURNED).equalityParameter(equalityField);
 * })
 */

// tests for adminAuthRegister


// tests for adminAuthLogin

beforeEach(() => {
  setData({
    users: [
      {
        email: 'comp1531@gmail.com',
        password: 'Aero321',
        nameFirst: 'Lara',
        nameLast: 'Cosio',
        authUserId: 1,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      },
      {
        email: 'aero1531@gmail.com',
        password: 'Comp321',
        nameFirst: 'Carmen',
        nameLast: 'Zhang',
        authUserId: 2,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    ] 
  });

});

afterAll(() => {
  setData({});
});

describe('Testing adminAuthLogin', () => {
  test('Return authUserId if email and password are both correct', () => {
    expect({ authUserId: adminAuthLogin('comp1531@gmail.com', 'Aero321')}).toStrictEqual({ authUserId: 1 });
    expect({ authUserId: adminAuthLogin('aero1531@gmail.com', 'Comp321')}).toStrictEqual({ authUserId: 2 });
  });
  test('Return error when email does not belong to a user', () => {
    expect({authUserId: adminAuthLogin('invalidemail@@com', 'asdfghjkl')}).toStrictEqual({ error: expect.any(String)});
  });
  test('Return error when password is not correct', () => {
    expect(adminAuthLogin('comp1531@gmail.com', 'Boost21')).toStrictEqual({ error: expect.any(String)});
  });
});

// tests for adminUserDetails

describe('Testing adminAuthDetails', () => {
  test('Return authUserId if email and password are both correct', () => {
    //two failed attempts
    adminAuthLogin('comp1531@gmail.com', '12345');
    adminAuthLogin('comp1531@gmail.com', '12345');
    expect(adminAuthDetails(1)).toStrictEqual({ 
      user:
      {
        userId: 1,
        name: 'Lara Cosio',
        email: 'comp1531@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 2,
      }
    });
  });
  test('Return error when AuthUserId is not a valid user', () => {
    expect(adminAuthDetails(5)).toStrictEqual({ error: expect.any(String)});
    expect(adminAuthDetails(8)).toStrictEqual({ error: expect.any(String)});
    expect(adminAuthDetails(0)).toStrictEqual({ error: expect.any(String)});
  });

});

