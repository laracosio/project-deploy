// function imports
import { adminQuizList } from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";

// test reset
beforeEach(() => {
    clear();
});

// adminQuizList tests
describe('adminQuizList - Error Cases', () => {
    test('invalid authUserId', () => {
        const invalidUserId = adminAuthRegister('bademail@@com', 'abc', 'g1g1', 'X');
        expect(adminQuizList(invalidUserId)).toStrictEqual( { ERROR });
    });
});

describe('adminQuizList - Passed Cases', () => {
    test('valid authUserId list', () => {
        const validuserId = adminAuthRegister('gina@unsw.edu.au', 'abcde12345!', 'Gina', 'Kong');
        expect(adminQuizList(validuserId)).toBe({
            quizId: expect.any(Number),
            name: expect.any(String),
          });
    });
});
