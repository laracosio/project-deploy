import request from 'sync-request-curl';
import { port, url } from '../config.json'

import {
  person1,
  person2,
  person3,
  person4,
  person5,
  validQuizName,
  newvalidQuizName,
  invalidQuizName,
  shortQuizName,
  longQuizName,
  validQuizDescription,
  newvalidQuizDescription,
  longQuizDescription,
} from '../testingData.js';

import { adminQuizCreate, adminQuizInfo, adminQuizList, adminQuizNameUpdate, adminQuizDescriptionUpdate } from '../features/quiz';
import { adminQuizRemove } from '../features/trash';
import { adminAuthRegister } from '../features/auth';
import { clear } from '../features//other';

beforeEach(() => {
  // clear
})

interface SessionReturn {
  token: string
}

const requestSession = (email: string, password: string, nameFirst: string, nameLast: string): SessionReturn => {
  const response = request('POST', `${SERVER_URL}/v1/auth/register`, { json: { email: email, password: password, nameFirst: nameFirst, nameLast: nameLast } });
  return JSON.parse(response.body.toString());
}

const SERVER_URL = `${url}:${port}`;

// adminQuizCreate tests
describe('quizRouter.post - Error Cases', () => {
  test('invalid token', () => {
    const session1 = requestSession(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const response = request('POST', `${SERVER_URL}/v1/admin/quiz`, { json: {token: session1.token, name: validQuizName, description: validQuizDescription} }); 
    expect(response.statusCode).toStrictEqual(401);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ error: 'Invalid token'});

    const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    // function adminQuizCreateFunc() {
    //   adminQuizCreate(session.token + 1, validQuizName, validQuizDescription);
    // }
    // expect(adminQuizCreateFunc).toThrow(ApiError);
    // expect(adminQuizCreateFunc).toThrow('Invalid token');
  });
  test('invalid name characters', () => {

    // const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    // function adminQuizCreateFunc() {
    //   adminQuizCreate(session.token, invalidQuizName, validQuizDescription);
    // }
    // expect(adminQuizCreateFunc).toThrow(ApiError);
    // expect(adminQuizCreateFunc).toThrow('Invalid name, must not contain special characters');
  });
  test('invalid name length too short', () => {
    // const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    // function adminQuizCreateFunc() {
    //   adminQuizCreate(session.token, shortQuizName, validQuizDescription);
    // }
    // expect(adminQuizCreateFunc).toThrow(ApiError);
    // expect(adminQuizCreateFunc).toThrow('Invalid name length');
  });
  test('invalid name length too long', () => {
    // const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    // function adminQuizCreateFunc() {
    //   adminQuizCreate(session.token, longQuizName, validQuizDescription);
    // }
    // expect(adminQuizCreateFunc).toThrow(ApiError);
    // expect(adminQuizCreateFunc).toThrow('Invalid name length');
  });
  test('existing name under same user', () => {
    // const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    // adminQuizCreate(session.token, validQuizName, validQuizDescription);
    // const invalidSecondQuizName = validQuizName;
    // function adminQuizCreateFunc() {
    //   adminQuizCreate(session.token, invalidSecondQuizName, validQuizDescription);
    // }
    // expect(adminQuizCreateFunc).toThrow(ApiError);
    // expect(adminQuizCreateFunc).toThrow('Quiz name already in use');
  });
  test('existing name under different user', () => {
    // const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    // const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    // adminQuizCreate(session.token, validQuizName, validQuizDescription);
    // adminQuizCreate(session.token, 'Quiz 2', validQuizDescription);
    // adminQuizCreate(session.token, 'Quiz 3', validQuizDescription);
    // adminQuizCreate(session.token, 'Potato Quiz', validQuizDescription);
    // expect(adminQuizCreate(session2.token, validQuizName, validQuizDescription).quizId).toStrictEqual(expect.any(Number));
  });
  test('invalid description length', () => {
    // const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    // function adminQuizCreateFunc() {
    //   adminQuizCreate(session.token, validQuizName, longQuizDescription);
    // }
    // expect(adminQuizCreateFunc).toThrow(ApiError);
    // expect(adminQuizCreateFunc).toThrow('Description must be less than 100 characters');
  });
});

describe('quizRouter.post - Passed Cases', () => {
  test('valid quiz details', () => {
    // const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    // const quizCreate = adminQuizCreate(session.token, validQuizName, validQuizDescription);
    // expect(quizCreate.quizId).toStrictEqual(expect.any(Number));
  });
  test('valid multiple quiz details', () => {
    // const session = adminAuthRegister(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    // adminQuizCreate(session.token, validQuizName, validQuizDescription);
    // const session2 = adminAuthRegister(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    // adminQuizCreate(session2.token, 'Quiz 2', '');
    // adminQuizCreate(session2.token, 'Quiz 3', '');
    // expect(adminQuizCreate(session2.token, 'Quiz 4', '')).toMatchObject({ quizId: expect.any(Number) });
  });
});