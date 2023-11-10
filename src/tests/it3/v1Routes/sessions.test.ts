// remove me and add your tests below
test('placeholder', () => {
  expect((1 + 1)).toBe(2);
});

import { authLoginRequest, clearRequest, authRegisterRequest, quizCreateRequest, createQuizQuestionRequest } from '../../it2-testing/serverTestHelperIt2';
import {person1, person2, validQuizDescription, validQuizName, validCreateQuestion } from '../../testingData';
import { startNewSessionRequest } from '../../serverTestHelperIt3';
import { validUpdateQuestion } from '../../../testingData';
import { quizCreateQuestion } from '../../../services/questionService';
beforeEach(() => {
  clearRequest();
});

// add to testing data
// const validAutoStartNum = '25'
// const invalidAutoStartNum = '51'

// Start new session tests
describe('startNewSession - Success cases', () => {
  let user1: Response, quiz1: Response, question1: Response;
  test('Update a quiz from no thumbnail to png thumbnail', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    const response = startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({sessionId: expect.any(Number)});
  });
});

  describe('startNewSession - Error cases', () => {
    let user1: Response, user2: Response, quiz1: Response, question1: Response;
    test('invalid token', () => {
      user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
      const user1Data = JSON.parse(user1.body.toString());
      quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
      const quiz1Data = JSON.parse(quiz1.body.toString());
      question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
      const response = startNewSessionRequest(user1Data.token + 1, quiz1Data.quizId, validAutoStartNum);
      expect(response.statusCode).toStrictEqual(401);
    });

    test('QuizId not owned by this user', () => {
      user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
      const user1Data = JSON.parse(user1.body.toString());
      user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
      const user2Data = JSON.parse(user2.body.toString());
      quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
      const quiz1Data = JSON.parse(quiz1.body.toString());
      question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
      const response = startNewSessionRequest(user2Data.token, quiz1Data.quizId, validAutoStartNum);
      expect(response.statusCode).toStrictEqual(403);
    });

    test('autoStartNum greater than 50', () => {
      user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
      const user1Data = JSON.parse(user1.body.toString());
      quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
      const quiz1Data = JSON.parse(quiz1.body.toString());
      question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
      const response = startNewSessionRequest(user1Data.token, quiz1Data.quizId, invalidAutoStartNum);
      expect(response.statusCode).toStrictEqual(400);
    });

    test('10 sessions that are not in end state exist', () => {
      user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
      const user1Data = JSON.parse(user1.body.toString());
      quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
      const quiz1Data = JSON.parse(quiz1.body.toString());
      question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
      //start 10 new sessions for quiz1
      startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      const response = startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      expect(response.statusCode).toStrictEqual(400);
    });

    test('Quiz does not have any questions', () => {
      user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
      const user1Data = JSON.parse(user1.body.toString());
      quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
      const quiz1Data = JSON.parse(quiz1.body.toString());
      const response = startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
      expect(response.statusCode).toStrictEqual(400);
    });
  });