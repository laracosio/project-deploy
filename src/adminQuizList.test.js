// function imports
import {
	person1,
	person2,
	person3,
} from './testingData.js';
import { adminQuizList, adminQuizCreate } from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";

// test reset
beforeEach(() => {
	clear();
});

// adminQuizList tests
describe('adminQuizList - Error Cases', () => {
	test('invalid authUserId', () => {
		const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		expect(adminQuizList(validUser1.authUserId + 100).error).toStrictEqual('Invalid user');
	});
});

describe('adminQuizList - Passed Cases', () => {
	test('valid user1 list', () => {
		const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		const validQuiz1 = adminQuizCreate(validUser1.authUserId, 'User1 first quiz', '');
		const validQuiz2 = adminQuizCreate(validUser1.authUserId, 'User1 second quiz', '');
		expect(adminQuizList(validUser1.authUserId)).toStrictEqual(
			{ quizzes: [
					{
						quizId: validQuiz1.quizId,
						name: 'User1 first quiz',
					},
					{
						quizId: validQuiz2.quizId,
						name: 'User1 second quiz',
					},
				]
			}
		)
	});
	test('valid user2 list', () => {
		const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		adminQuizCreate(validUser1.authUserId, 'User1 first quiz', '');
		adminQuizCreate(validUser1.authUserId, 'User1 second quiz', '');
		const validUser2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
		const validQuiz3 = adminQuizCreate(validUser2.authUserId, 'User2 first quiz', '');
		expect(adminQuizList(validUser2.authUserId)).toStrictEqual(
			{ quizzes: [
					{
						quizId: validQuiz3.quizId,
						name: 'User2 first quiz',
					},
				]
			}
		)
	});
	test('valid user3 list', () => {
		const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		adminQuizCreate(validUser1.authUserId, 'User1 first quiz', '');
		adminQuizCreate(validUser1.authUserId, 'User1 second quiz', '');
		adminQuizCreate(validUser1.authUserId, 'User1 third quiz', '');
		const validUser2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
		adminQuizCreate(validUser2.authUserId, 'User2 first quiz', '');
		adminQuizCreate(validUser2.authUserId, 'User2 second quiz', '');
		adminQuizCreate(validUser2.authUserId, 'User2 third quiz', '');
		const validUser3 = adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
		const validQuiz7 = adminQuizCreate(validUser3.authUserId, 'User3 first quiz', '');
		const validQuiz8 = adminQuizCreate(validUser3.authUserId, 'User3 second quiz', '');
		const validQuiz9 = adminQuizCreate(validUser3.authUserId, 'User3 third quiz', '');
		const validQuiz10 = adminQuizCreate(validUser3.authUserId, 'User3 fourth quiz', '');
		expect(adminQuizList(validUser3.authUserId)).toStrictEqual(
			{ quizzes: [
					{
						quizId: validQuiz7.quizId,
						name: 'User3 first quiz',
					},
					{
						quizId: validQuiz8.quizId,
						name: 'User3 second quiz',
					},
					{
						quizId: validQuiz9.quizId,
						name: 'User3 third quiz',
					},
					{
						quizId: validQuiz10.quizId,
						name: 'User3 fourth quiz',
					},
				]
			}
		)
	});
});
