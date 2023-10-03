// function imports
import {
	person1,
	person2,
	person3,
	person4,
	person5,
	validQuizDescription,
	validQuizName,
} from './testingData.js';
import { adminQuizCreate, adminQuizInfo } from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";

// test reset and test data
let validUser1, validUser2, validUser5;
let validQuizId, validUser2Quiz, validUser5Quiz;

beforeEach(() => {
	clear();
	validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
	validQuizId = adminQuizCreate(validUser1.authUserId, validQuizName, validQuizDescription);
	validUser2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
	validUser2Quiz = adminQuizCreate(validUser2.authUserId, 'User2s quiz', '');
	adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
	adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
	validUser5 = adminAuthRegister(person5.email, person5.password, person5.nameFirst, person5.nameLast);
	validUser5Quiz = adminQuizCreate(validUser5.authUserId, 'User5s quiz', '');
});

// adminQuizInfo tests
describe('adminQuizInfo - Error Cases', () => {
	test('invalid authUserId', () => {
		expect(adminQuizInfo(validUser1.authUserId + 100, validQuizId.quizId).error).toStrictEqual('Invalid user');
	});
	test('invalid quizId', () => {
		expect(adminQuizInfo(validUser1.authUserId, validQuizId.quizId + 100).error).toStrictEqual('Invalid quiz ID');
	});
	test('quizId not owned by this user', () => {
		expect(adminQuizInfo(validUser2.authUserId, validQuizId.quizId).error).toStrictEqual('Quiz ID not owned by this user');
	});
});

describe('adminQuizInfo - Passed Cases', () => {
	test('valid authUserId and quizId', () => {
		expect(adminQuizInfo(validUser1.authUserId, validQuizId.quizId)).toStrictEqual(
			{
				quizId: validQuizId.quizId,
				name: validQuizName,
				timeCreated: expect.any(Number),
				timeLastEdited: expect.any(Number),
				description: validQuizDescription,
				quizOwner: validUser1.authUserId,
			}
		)
	});
	test('user 2s quiz', () => {
		expect(adminQuizInfo(validUser2.authUserId, validUser2Quiz.quizId)).toStrictEqual(
			{
				quizId: validUser2Quiz.quizId,
				name: 'User2s quiz',
				timeCreated: expect.any(Number),
				timeLastEdited: expect.any(Number),
				description: '',
				quizOwner: validUser2.authUserId,
			}
		)
	})
	test('user 5s quiz', () => {
		expect(adminQuizInfo(validUser5.authUserId, validUser5Quiz.quizId)).toStrictEqual(
			{
				quizId: validUser5Quiz.quizId,
				name: 'User5s quiz',
				timeCreated: expect.any(Number),
				timeLastEdited: expect.any(Number),
				description: '',
				quizOwner: validUser5.authUserId,
			}
		)
	})
});