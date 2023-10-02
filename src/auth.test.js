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

// tests for adminUserDetails

describe('Testing adminAuthDetails', () => {
  test('Return authUserId if email and password are both correct', () => {
    
    let user1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    let user2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    let user3 = adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    let user4 = adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
    
    //two failed attempts
    adminAuthLogin(user1.email, user2.password);
    adminAuthLogin(user1.email, user3.password);
    expect(adminAuthDetails(user1.userId)).toStrictEqual({ 
      user:
      {
        userId: user1.userId,
        name: user1.name,
        email: user1.email,
        numSuccessfulLogins: user1.numSuccessfulLogins,
        numFailedPasswordsSinceLastLogin: user1.numFailedPasswordsSinceLastLogin,
      }
    });
    expect(adminAuthDetails(user4.userId)).toStrictEqual({ 
      user:
      {
        userId: user4.userId,
        name: user4.name,
        email: user4.email,
        numSuccessfulLogins: user4.numSuccessfulLogins,
        numFailedPasswordsSinceLastLogin: user4.numFailedPasswordsSinceLastLogin,
      }
    });
  });
  test('Return error when AuthUserId is not a valid user', () => {
    expect(adminAuthDetails(10)).toStrictEqual({ error: expect.any(String)});
    expect(adminAuthDetails(8)).toStrictEqual({ error: expect.any(String)});
    expect(adminAuthDetails(0)).toStrictEqual({ error: expect.any(String)});
  });

});

