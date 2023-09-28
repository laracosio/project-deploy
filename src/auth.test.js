// functions to import
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
describe('Success cases - adminAuthRegister', () => {
  test('1 user', () => {
    expect(adminAuthRegister('testEmail@unsw.edu.au', 'password123', 'John', 'Smith').toMatchObject({ authUserId: 1 }));
  })
  test('2 users', () => {
    adminAuthRegister('testEmail1@unsw.edu.au', 'password123', 'John', 'Smith');
    expect(adminAuthRegister('testEmail2@unsw.edu.au', 'password456', 'Jane', 'Doe').toMatchObject({ authUserId: 2}));
  })
  test('3 users', () => {
    adminAuthRegister('testEmail2@unsw.edu.au', 'password123', 'John', 'Smith');
    adminAuthRegister('testEmail2@unsw.edu.au', 'password456', 'Jane', 'Doe');
    expect(adminAuthRegister('testEmail3@unsw.edu.au', 'password789', 'Pumpkin', 'Gizmo').toMatchObject({ authUserId: 3}));
  })
})

describe('Error cases - adminAuthRegister', () => {
  test('email address - duplicate', () => {
    adminAuthRegister('testEmail@unsw.edu.au', 'password123', 'John', 'Smith');
    expect(adminAuthRegister('testEmail@unsw.edu.au', 'password456', 'Jane', 'Doe').toStrictEqual({ ERROR }));
  })
  test('email address - invalid', () => {
    expect(adminAuthRegister('testEmail@@unsw.edu.au', 'password456', 'Jane', 'Doe').toStrictEqual({ ERROR }));
  })
  test('first name - invalid characters', () => {
    expect(adminAuthRegister('testEmail@@unsw.edu.au', 'password456', '123', 'Doe').toStrictEqual({ ERROR }));
  })
  test('first name - too short', () => {
    expect(adminAuthRegister('testEmail@@unsw.edu.au', 'password456', 'J', 'Doe').toStrictEqual({ ERROR }));
  })
  test('first name - too long', () => {
    expect(adminAuthRegister('testEmail@@unsw.edu.au', 'password456', 'JaneDoeDoeDoeDoeDoeDoe', 'Doe').toStrictEqual({ ERROR }));
  })
  test('last name - invalid characters', () => {
    expect(adminAuthRegister('testEmail@unsw.edu.au', 'password456', 'Jane', '123').toStrictEqual({ ERROR }));
  })
  test('last name - too short', () => {
    expect(adminAuthRegister('testEmail@unsw.edu.au', 'password456', 'Jane', 'D').toStrictEqual({ ERROR }));
  })
  test('last name - too long', () => {
    expect(adminAuthRegister('testEmail@unsw.edu.au', 'password456', 'Jane', 'DoeDoeDoeDoeDoeDoeDoe').toStrictEqual({ ERROR }));
  })
  test('password - too short', () => {
    expect(adminAuthRegister('testEmail@unsw.edu.au', '123567', 'Jane', 'Doe').toStrictEqual({ ERROR }));
  })
  test('password - all letters', () => {
    expect(adminAuthRegister('testEmail@unsw.edu.au', 'ABCDEFGH', 'Jane', 'Doe').toStrictEqual({ ERROR }));
  })
  test('password - all numbers', () => {
    expect(adminAuthRegister('testEmail@unsw.edu.au', '1235678', 'Jane', 'Doe').toStrictEqual({ ERROR }));
  })
})

// tests for adminAuthLogin


// tests for adminUserDetails