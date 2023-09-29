// functions/data to import
import { person1, person2, person3, person4, person5, person6, person7 } from '.testingData.js';

//e.g. import { clear, movieAdd, movieEdit, moviesList } from './movie';
const ERROR = { error: expect.any(String)};

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
        expect(adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast).toMatchObject({ authUserId: 1 }));
    })
    test('2 users', () => {
        adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
        expect(adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast).toMatchObject({ authUserId: 2}));
    })
    test('7 users', () => {
        adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
        adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
        adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
        adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
        adminAuthRegister(person5.email, person5.password, person5.nameFirst, person5.nameLast);
        adminAuthRegister(person6.email, person6.password, person6.nameFirst, person6.nameLast);
        expect(adminAuthRegister(person7.email, person7.password, person7.nameFirst, person7.nameLast).toMatchObject({ authUserId: 7}));
    })
})

describe('adminAuthRegister - Error Cases', () => {
    test('email address - duplicate', () => {
        adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
        expect(adminAuthRegister(person1.email, person2.password, person2.nameFirst, person2.nameLast).toStrictEqual({ ERROR }));
    })
    test('email address - invalid', () => {
        expect(adminAuthRegister('h.simpson@@springfield.com', person1.password, person1.nameFirst, person1.nameLast).toStrictEqual({ ERROR }));
    })
    test('first name - invalid characters', () => {
        expect(adminAuthRegister(person1.email, person1.password, 'H0mer', person1.nameLast).toStrictEqual({ ERROR }));
    })
    test('first name - too short', () => {
        expect(adminAuthRegister(person1.email, person1.password, 'H', person1.nameLast).toStrictEqual({ ERROR }));
    })
    test('first name - too long', () => {
        expect(adminAuthRegister(person1.email, person1.password, 'HomerHasAVeryLongName', person1.nameLast).toStrictEqual({ ERROR }));
    })
    test('last name - invalid characters', () => {
        expect(adminAuthRegister(person1.email, person1.password, person1.nameFirst, '$!MP$0N').toStrictEqual({ ERROR }));
    })
    test('last name - too short', () => {
        expect(adminAuthRegister(person1.email, person1.password, person1.nameFirst, 'S').toStrictEqual({ ERROR }));
    })
    test('last name - too long', () => {
        expect(adminAuthRegister(person1.email, person1.password, person1.nameFirst, 'SimpsonSimpsonSimpson').toStrictEqual({ ERROR }));
    })
    test('password - too short', () => {
        expect(adminAuthRegister(person1.email, 'a1', person1.nameFirst, person1.nameLast).toStrictEqual({ ERROR }));
    })
    test('password - all letters', () => {
        expect(adminAuthRegister(person1.email, 'ABCDEFG', person1.nameFirst, person1.nameLast).toStrictEqual({ ERROR }));
    })
    test('password - all numbers', () => {
        expect(adminAuthRegister(person1.email, '1234567', person1.nameFirst, person1.nameLast).toStrictEqual({ ERROR }));
    })
})

// tests for adminAuthLogin


// tests for adminUserDetails