// function imports
import { adminQuizInfo } from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";

// test reset and test data
beforeEach(() => {
    clear();
    const validuserId = adminAuthRegister('gina@unsw.edu.au', 'abcde12345!', 'Gina', 'Kong');
    const invalidUserId = adminAuthRegister('bademail@@com', 'abc', 'g1g1', 'X');
    const validQuizId = 1;
    const invalidQuizId = 'a';
    const unownedQuizId = 2;
});

// adminQuizInfo tests
describe('adminQuizInfo - Error Cases', () => {
    test('invalid authUserId', () => {
        expect(adminQuizInfo(invalidUserId, validQuizId)).toStrictEqual({ ERROR });
    });
    test('invalid quizId', () => {
        expect(adminQuizInfo(validuserId, invalidQuizId)).toStrictEqual({ ERROR });
    });
    test('quizId not owned by this user', () => {
        expect(adminQuizInfo(validuserId, unownedQuizId)).toStrictEqual({ ERROR });
    });
});

describe('adminQuizInfo - Passed Cases', () => {
    test('valid authUserId and quizId', () => {
        expect(adminQuizInfo(validQuizId, validQuizId)).toBe({
            quizId: expect.any(Number),
            name: expect.any(String),
            timeCreated: expect.any(Number),
            timeLastEdited: expect.any(Number),
            description: expect.any(String),
            })
    });
});