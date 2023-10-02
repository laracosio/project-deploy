// functions/data to import
import { person1, person2, person3, person4, person5, person6, person7} from './testingData.js';
import { adminAuthRegister } from './auth.js';
import { clear } from './other.js';

const ERROR = { error: expect.any(String)};

import { adminAuthLogin, adminAuthDetails } from './auth.js';
import { setData } from './dataStore.js';
// Any test resets
beforeEach(() => {
  clear();
});
  

/** test template
 * describe('testGroupName', () => {
 *  test('nameOfIndividualTest', () => {
 *   TESTCODE_GOES_HERE
 *  expect(WHAT_YOU_EXPECT_TO_BE_RETURNED).equalityParameter(equalityField);
 * })
 */

// tests for adminAuthRegister
describe('adminAuthRegister - Success Cases', () => {
  test('1 user', () => {
    expect(adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast)).toMatchObject({ authUserId: expect.any(Number) });
  })
  test('2 users', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    expect(adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast)).toMatchObject({ authUserId: expect.any(Number) });
  })
  test('7 users', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
    adminAuthRegister(person5.email, person5.password, person5.nameFirst, person5.nameLast);
    adminAuthRegister(person6.email, person6.password, person6.nameFirst, person6.nameLast);
    expect(adminAuthRegister(person7.email, person7.password, person7.nameFirst, person7.nameLast)).toMatchObject({ authUserId: expect.any(Number) });
  })
})

describe('adminAuthRegister - Error Cases', () => {
  test('email address - duplicate', () => {
    adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    expect(adminAuthRegister(person1.email, person2.password, person2.nameFirst, person2.nameLast)).toStrictEqual(ERROR);
  })
  test('email address - invalid', () => {
    expect(adminAuthRegister('h.simpson@@springfield.com', person1.password, person1.nameFirst, person1.nameLast)).toStrictEqual(ERROR);
  })
  test('first name - invalid characters', () => {
    expect(adminAuthRegister(person1.email, person1.password, 'H0mer', person1.nameLast)).toStrictEqual(ERROR);
  })
  test('first name - too short', () => {
    expect(adminAuthRegister(person1.email, person1.password, 'H', person1.nameLast)).toStrictEqual(ERROR);
  })
  test('first name - too long', () => {
    expect(adminAuthRegister(person1.email, person1.password, 'HomerHasAVeryLongName', person1.nameLast)).toStrictEqual(ERROR);
  })
  test('last name - invalid characters', () => {
    expect(adminAuthRegister(person1.email, person1.password, person1.nameFirst, '$!MP$0N')).toStrictEqual(ERROR);
  })
  test('last name - too short', () => {
    expect(adminAuthRegister(person1.email, person1.password, person1.nameFirst, 'S')).toStrictEqual(ERROR);
  })
  test('last name - too long', () => {
    expect(adminAuthRegister(person1.email, person1.password, person1.nameFirst, 'SimpsonSimpsonSimpson')).toStrictEqual(ERROR);
  })
  test('password - too short', () => {
    expect(adminAuthRegister(person1.email, 'a1', person1.nameFirst, person1.nameLast)).toStrictEqual(ERROR);
  })
  test('password - all letters', () => {
    expect(adminAuthRegister(person1.email, 'ABCDEFG', person1.nameFirst, person1.nameLast)).toStrictEqual(ERROR);
  })
  test('password - all numbers', () => {
    expect(adminAuthRegister(person1.email, '1234567', person1.nameFirst, person1.nameLast)).toStrictEqual(ERROR);
  })
})

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

