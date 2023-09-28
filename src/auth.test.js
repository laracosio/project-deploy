// functions to import
//e.g. import { clear, movieAdd, movieEdit, moviesList } from './movie';


/* 
TO DO!! 
'auth.js' or auth.js ??? 
*/
import { adminAuthLogin } from 'auth.js';

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

let validUser = any;
let invalidUser = any;

beforeEach(() => {
  clear();
  validUser = adminAuthRegister('comp1531@gmail.com', 'Aero321', 'Lara', 'Cosio');	
  invalidUser = adminAuthRegister('invalidemail@@com', 'asdfghjkl', '14r4', 'C')
});

afterAll(() => {
  clear();
});


describe('Testing adminAuthLogin', () => {
  test('Return authUserId if email and password are both correct', () => {
    expect(adminAuthLogin(validUser)).toStrictEqual({ authUserId: expect.any(Number) });
  });
  test('Return error when email does not belong to a user', () => {
    expect(adminAuthLogin(invalidUser)).toStrictEqual({ error: expect.any(String)});
  });
  test('Return error when password is not correct', () => {
    expect(user1).toEqual({ authUserId: expect.any(Number) });
    expect(adminAuthLogin('comp1531@gmail.com', 'Boost21')).toStrictEqual({ error: expect.any(String)});
  });
});

// tests for adminUserDetails

describe('Testing adminAuthDetails', () => {
    test('Return authUserId if email and password are both correct', () => {
        // TO DO!  
      expect(adminAuthDetails(validUser)).toStrictEqual({ authUserId: expect.any(Number) });
    });
    test('Return error when AuthUserId is not a valid user', () => {
      expect(adminAuthDetails(invalidUser)).toStrictEqual({ error: expect.any(String)});
    });

  });
