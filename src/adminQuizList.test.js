// function imports
import {
	person1,
	person2
} from './testingData.js';
import { adminQuizList, adminQuizCreate } from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";

// test reset
let validUser1;
let validUser2;
let validQuiz1;
let validQuiz2;
let validQuiz3;

beforeEach(() => {
	clear();
	validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
	validQuiz1 = adminQuizCreate(validUser1.authUserId, 'User1 first quiz', '');
	validUser2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
	validQuiz2 = adminQuizCreate(validUser1.authUserId, 'User1 second quiz', '');
	validQuiz3 = adminQuizCreate(validUser2.authUserId, 'User2 first quiz', '');
});

// adminQuizList tests
describe('adminQuizList - Error Cases', () => {
	test('invalid authUserId', () => {
		expect(adminQuizList(validUser1.authUserId + 100).error).toStrictEqual('Invalid user');
	});
});

describe('adminQuizList - Passed Cases', () => {
	test.only('valid user1 list', () => {
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
		expect(adminQuizList(validUser2.authUserId)).toStrictEqual(
			{ quizzes: [
					{
						quizId: validQuiz2.quizId,
						name: 'User2 first quiz',
					},
				]
			}
		)
	});
});
