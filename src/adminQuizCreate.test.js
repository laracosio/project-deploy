// function imports
import { adminQuizCreate} from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";

// test reset and test data
beforeEach(() => {
    clear();
    const validuserId = adminAuthRegister('gina@unsw.edu.au', 'abcde12345!', 'Gina', 'Kong');
    const invalidUserId = adminAuthRegister('bademail@@com', 'abc', 'g1g1', 'X');
    const validQuizName = 'My Quiz 1';
    const invalidQuizName = 'qu!z n@me';
    const shortQuizName = 'hi';
    const longQuizName = "this is longer than thirty characters"
    const validQuizDescription = 'This quiz is awesome';
    const longQuizDescription = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean moon.';

});

// adminQuizCreate tests
describe('adminQuizCreate - Error Cases', () => {
    test('invalid authUserId', () => {
        expect(adminQuizCreate(invalidUserId, validQuizName, validQuizDescription)).toStrictEqual({ ERROR });
    });
    test('invalid name characters', () => {
        expect(adminQuizCreate(validuserId, invalidQuizName, validQuizDescription)).toStrictEqual({ ERROR });
    });
    test('invalid name length too short', () => {
        expect(adminQuizCreate(validuserId, shortQuizName, validQuizDescription)).toStrictEqual({ ERROR });
    });
    test('invalid name length too long', () => {
        expect(adminQuizCreate(validuserId, longQuizName, validQuizDescription)).toStrictEqual({ ERROR });
    });
    test('existing name', () => {
        adminQuizCreate(validuserId, validQuizName, validQuizDescription);
        const invalidSecondQuizName = validQuizName;
        expect(adminQuizCreate(validuserId, invalidSecondQuizName, validQuizDescription)).toStrictEqual({ ERROR });
    });
    test('invalid description length', () => {
        expect(adminQuizCreate(validuserId, validQuizName, longQuizDescription)).toStrictEqual({ ERROR });
    });
});

describe('adminQuizCreate - Passed Cases', () => {
    test('valid quiz details', () => {
        expect(adminQuizCreate(validuserId, validQuizName, validQuizDescription)).toBe({
            quizId: expect.any(Number),
          })
    })
})
