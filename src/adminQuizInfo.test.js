// function imports
import { adminQuizCreate, adminQuizInfo } from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";

// test reset and test data
beforeEach(() => {
    clear();
    const validUserId = adminAuthRegister('gina@unsw.edu.au', 'abcde12345!', 'Gina', 'Kong');
    const validUserId2 = adminAuthRegister('josh@unsw.edu.au', '1234abcd', 'Josh', 'Beltran');
    const validQuizId = adminQuizCreate(validUserId.authUserId, 'My Quiz', 'This quiz is awesome');
    const validQuizId2 = adminQuizCreate(validUserId2.authUserId, 'Another Quiz', 'This quiz is the best');
});

// adminQuizInfo tests
describe('adminQuizInfo - Error Cases', () => {
    test('invalid authUserId', () => {
        expect(adminQuizInfo(validUserId.authUserId + 1, validQuizId.quizId)).toStrictEqual({ ERROR });
    });
    test('invalid quizId', () => {
        expect(adminQuizInfo(validUserId.authUserId, validQuizId.quizId + 1)).toStrictEqual({ ERROR });
    });
    test('quizId not owned by this user', () => {
        expect(adminQuizInfo(validUserId.authUserId, validQuizId2.quizId)).toStrictEqual({ ERROR });
    });
});

describe('adminQuizInfo - Passed Cases', () => {
    test('valid authUserId and quizId', () => {
        expect(adminQuizInfo(validUserId.authUserId, validQuizId.quizId)).toBe({
            quizId: expect.any(Number),
            name: expect.any(String),
            timeCreated: expect.any(Number),
            timeLastEdited: expect.any(Number),
            description: expect.any(String),
            })
    });
});