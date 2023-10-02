// function imports
import { adminQuizList } from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";

// test reset
beforeEach(() => {
    clear();
});

// test data
    // valid
    const validauthUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const validQuizId = adminQuizCreate(personId, 'Quiz 1 Name', 'Quiz 1 Description');
    const validName = 'Quiz 1 Name';
    const validDescription = 'Quiz 1 Description';
    
    // invalid
    const invalidauthUserId = 2;
    const invalidQuizId = 2;
    const diffvalidauthUserId = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const invalidCharInName = 'N@me that contains invalid characters';
    const invalidNameLength = 'Name contains less than 3 characters or more than 30 characters';
    const NameTaken = 'Quiz 1 Name';
    const invalidDescriptionLength = 'Description contains more than 100 characters'

    
    // adminQuizDescriptionUpdate tests

describe('adminQuizDescriptionUpdate - Success Cases', () => {
    test('valid authUserId, quizId and description', () => {
        expect(adminQuizDescriptionUpdate(validauthUserId, validQuizId, validDescription)).toBe({
        })
    })
})

describe('adminQuizRemove - Error Cases', () => {
    test('invalid authUserId', () => {
        expect.adminQuizRemove(invalidauthUserId, validQuizId, validName).toStrictEqual({ ERROR });
    })
    test('invalid QuizId', () => {
        expect.adminQuizRemove(validauthUserId, invalidQuizId, validName).toStrictEqual({ ERROR });
    })
    test('QuizId not owned by this user', () => {
        expect.adminQuizRemove(diffvalidauthUserId, validQuizId, validName).toStrictEqual({ ERROR });
    })
    test('invalid Description length', () => {
        expect.adminQuizRemove(validauthUserId, validQuizId, invalidDescriptionLength).toStrictEqual({ ERROR });
    })
})