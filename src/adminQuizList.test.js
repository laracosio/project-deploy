// function imports
import { adminQuizList, adminQuizCreate } from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";

// test reset
beforeEach(() => {
    clear();
    const validUserId = adminAuthRegister('gina@unsw.edu.au', 'abcde12345!', 'Gina', 'Kong');
    const validQuiz = adminQuizCreate(validUserId.authUserId, 'My Quiz', 'Best quiz ever');
});

// adminQuizList tests
describe('adminQuizList - Error Cases', () => {
    test('invalid authUserId', () => {
        expect(adminQuizList(validUserId.authUserId + 1)).toStrictEqual( { ERROR });
    });
});

describe('adminQuizList - Passed Cases', () => {
    test('valid authUserId list', () => {
        expect(adminQuizList(validuserId.authUserId)).toBe({
            quizId: validQuiz.quizId,
            name: 'My Quiz',
          });
    });
});
