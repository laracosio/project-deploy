// function imports
import { 
	person1,
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
let validUserId;

beforeEach(() => {
	clear();
	validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
});

// adminQuizCreate tests
describe('adminQuizCreate - Error Cases', () => {
	test('invalid authUserId', () => {
		expect(adminQuizCreate(validUserId.authUserId + 1, validQuizName, validQuizDescription).error).toStrictEqual('Invalid user');
	});
	test('invalid name characters', () => {
		expect(adminQuizCreate(validUserId.authUserId, invalidQuizName, validQuizDescription).error).toStrictEqual('Invalid name, must not contain special characters');
	});
	test('invalid name length too short', () => {
		expect(adminQuizCreate(validUserId.authUserId, shortQuizName, validQuizDescription).error).toStrictEqual('Invalid name length');
	});
	test('invalid name length too long', () => {
		expect(adminQuizCreate(validUserId.authUserId, longQuizName, validQuizDescription).error).toStrictEqual('Invalid name length');
	});
	test('existing name', () => {
		adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
		const invalidSecondQuizName = validQuizName;
		expect(adminQuizCreate(validUserId.authUserId, invalidSecondQuizName, validQuizDescription).error).toStrictEqual('Quiz name already in use');
	});
	test('invalid description length', () => {
		expect(adminQuizCreate(validUserId.authUserId, validQuizName, longQuizDescription).error).toStrictEqual('Description must be less than 100 characters');
	});
});

describe('adminQuizCreate - Passed Cases', () => {
	test('valid quiz details', () => {
		const quizCreate = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription)
		expect(quizCreate.quizId).toEqual(expect.any(Number))
	})
})
