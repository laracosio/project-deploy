// functions to import
//e.g. import { clear, movieAdd, movieEdit, moviesList } from './movie';


/* 
TO DO!! 
'auth.js' or auth.js ??? 
*/
import { adminAuthRegister, adminAuthLogin } from 'auth.js';
import { person1, person2, person3, person4, person5, person6, person7 } from '.testingData.js';
import { clear } from '.other.js'

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

 clear();

});


describe('Testing adminAuthLogin', () => {
  test('Return authUserId if email and password are both correct', () => {
    let user1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    let user2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    let user3 = adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    let user4 = adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
    expect(adminAuthLogin(person1.email, person1.password)).toStrictEqual(user1);
    expect(adminAuthLogin(person2.email, person2.password)).toStrictEqual(user2);
    expect(adminAuthLogin(person3.email, person3.password)).toStrictEqual(user3);
    expect(adminAuthLogin(person4.email, person4.password)).toStrictEqual(user4);
  });
  test('Return error when email does not belong to a user', () => {
    expect(adminAuthLogin(person5.email, person5.password)).toStrictEqual({ error: expect.any(String)});
  });
  test('Return error when password is not correct', () => {
    expect(adminAuthLogin(person1.email, person4.password)).toStrictEqual({ error: expect.any(String)});
  });
});

// tests for adminUserDetails

