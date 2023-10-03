// function imports
import { 
	person1,
	person2,
	person3, 
	person4,
	person5,
	validQuizName,
	invalidQuizName,
	shortQuizName,
	longQuizName,
	validQuizDescription,
	longQuizDescription, 
} from './testingData.js';
import { adminQuizCreate, adminQuizInfo} from "./quiz";
import { adminAuthRegister } from "./auth";
import { clear } from "./other";

// test reset
beforeEach(() => {
	clear();
});

// adminQuizCreate tests
describe('adminQuizCreate - Error Cases', () => {
	test('invalid authUserId', () => {
		const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		expect(adminQuizCreate(validUserId.authUserId + 1, validQuizName, validQuizDescription).error).toStrictEqual('Invalid user');
	});
	test('invalid name characters', () => {
		const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		expect(adminQuizCreate(validUserId.authUserId, invalidQuizName, validQuizDescription).error).toStrictEqual('Invalid name, must not contain special characters');
	});
	test('invalid name length too short', () => {
		const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		expect(adminQuizCreate(validUserId.authUserId, shortQuizName, validQuizDescription).error).toStrictEqual('Invalid name length');
	});
	test('invalid name length too long', () => {
		const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		expect(adminQuizCreate(validUserId.authUserId, longQuizName, validQuizDescription).error).toStrictEqual('Invalid name length');
	});
	test('existing name under same user', () => {
		const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
		const invalidSecondQuizName = validQuizName;
		expect(adminQuizCreate(validUserId.authUserId, invalidSecondQuizName, validQuizDescription).error).toStrictEqual('Quiz name already in use');
	});
	test('existing name under different user', () => {
		const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		const validUserId2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
		adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription);
		adminQuizCreate(validUserId.authUserId, 'Quiz 2', validQuizDescription);
		adminQuizCreate(validUserId.authUserId, 'Quiz 3', validQuizDescription);
		adminQuizCreate(validUserId2.authUserId, 'Potato Quiz', validQuizDescription);
		expect(adminQuizCreate(validUserId2.authUserId, validQuizName, validQuizDescription).quizId).toStrictEqual(expect.any(Number));
	});
	test('invalid description length', () => {
		const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		expect(adminQuizCreate(validUserId.authUserId, validQuizName, longQuizDescription).error).toStrictEqual('Description must be less than 100 characters');
	});
});

describe('adminQuizCreate - Passed Cases', () => {
	test('valid quiz details', () => {
		const validUserId = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		const quizCreate = adminQuizCreate(validUserId.authUserId, validQuizName, validQuizDescription)
		expect(quizCreate.quizId).toStrictEqual(expect.any(Number))
	})
})

// adminQuizInfo tests
describe('adminQuizInfo - Error Cases', () => {
	test('invalid authUserId', () => {
		const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		const validQuizId = adminQuizCreate(validUser1.authUserId, validQuizName, validQuizDescription);
		expect(adminQuizInfo(validUser1.authUserId + 100, validQuizId.quizId).error).toStrictEqual('Invalid user');
	});
	test('invalid quizId', () => {
		const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		const validQuizId = adminQuizCreate(validUser1.authUserId, validQuizName, validQuizDescription);
		expect(adminQuizInfo(validUser1.authUserId, validQuizId.quizId + 100).error).toStrictEqual('Invalid quiz ID');
	});
	test('quizId not owned by this user', () => {
		const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		const validQuizId = adminQuizCreate(validUser1.authUserId, validQuizName, validQuizDescription);
		const validUser2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
		expect(adminQuizInfo(validUser2.authUserId, validQuizId.quizId).error).toStrictEqual('Quiz ID not owned by this user');
	});
});

describe('adminQuizInfo - Passed Cases', () => {
	test('one valid authUserId and quizId', () => {
		const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		const validQuizId = adminQuizCreate(validUser1.authUserId, validQuizName, validQuizDescription);
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
	test('find user2 quiz from dataStore with two registered users', () => {
		const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		adminQuizCreate(validUser1.authUserId, validQuizName, validQuizDescription);
		const validUser2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
		const validUser2Quiz = adminQuizCreate(validUser2.authUserId, 'User2s quiz', '');
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
	test('find user5 quiz from dataStore with five registered users', () => {
		const validUser1 = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
		adminQuizCreate(validUser1.authUserId, validQuizName, validQuizDescription);
		const validUser2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
		adminQuizCreate(validUser2.authUserId, 'User2s quiz', '');
		adminAuthRegister(person3.email, person3.password, person3.nameFirst, person3.nameLast);
		adminAuthRegister(person4.email, person4.password, person4.nameFirst, person4.nameLast);
		const validUser5 = adminAuthRegister(person5.email, person5.password, person5.nameFirst, person5.nameLast);
		const validUser5Quiz = adminQuizCreate(validUser5.authUserId, 'User5s quiz', '');
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

