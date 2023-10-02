// function imports
import { 
    validQuizName,
    invalidQuizName,
    shortQuizName,
    longQuizName,
    validQuizDescription,
    longQuizDescription, 
} from './testingData.js';
import { adminQuizCreate} from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";

// test reset and test data
beforeEach(() => {
    clear();
    const validuserId = adminAuthRegister('gina@unsw.edu.au', 'abcde12345!', 'Gina', 'Kong');
});

// adminQuizCreate tests
describe('adminQuizCreate - Error Cases', () => {
    test('invalid authUserId', () => {
        expect(adminQuizCreate(validUserId.authUserId + 1, validQuizName, validQuizDescription)).toStrictEqual({ ERROR });
    });
    test('invalid name characters', () => {
        expect(adminQuizCreate(validuserId.authUserId, invalidQuizName, validQuizDescription)).toStrictEqual({ ERROR });
    });
    test('invalid name length too short', () => {
        expect(adminQuizCreate(validuserId.authUserId, shortQuizName, validQuizDescription)).toStrictEqual({ ERROR });
    });
    test('invalid name length too long', () => {
        expect(adminQuizCreate(validuserId.authUserId, longQuizName, validQuizDescription)).toStrictEqual({ ERROR });
    });
    test('existing name', () => {
        adminQuizCreate(validuserId.authUserId, validQuizName, validQuizDescription);
        const invalidSecondQuizName = validQuizName;
        expect(adminQuizCreate(validuserId.authUserId, invalidSecondQuizName, validQuizDescription)).toStrictEqual({ ERROR });
    });
    test('invalid description length', () => {
        expect(adminQuizCreate(validuserId.authUserId, validQuizName, longQuizDescription)).toStrictEqual({ ERROR });
    });
});

describe('adminQuizCreate - Passed Cases', () => {
    test('valid quiz details', () => {
        expect(adminQuizCreate(validuserId.authUserId, validQuizName, validQuizDescription)).toBe({
            quizId: expect.any(Number),
          })
    })
})
