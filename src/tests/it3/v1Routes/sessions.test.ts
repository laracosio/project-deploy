import { clearRequest, authRegisterRequest, quizCreateRequest, createQuizQuestionRequest } from '../../it2/serverTestHelperIt2';
import { person1, person2, validQuizDescription, validQuizName, validCreateQuestion, validAutoStartNum, invalidAutoStartNum } from '../../../testingData';
import { startNewSessionRequest } from '../../serverTestHelperIt3';
import { Response } from 'sync-request-curl';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';

beforeEach(() => {
  clearRequest();
});

// Start new session tests
describe('startNewSession - Success cases', () => {
  let user1: Response, quiz1: Response;
  test('Start a new session for a quiz', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const response = startNewSessionRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(response.statusCode).toStrictEqual(HttpStatusCode.OK);
    expect(responseData).toStrictEqual({ sessionId: expect.any(Number) });
  });
  test('2 sessions for different quizzes', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const quiz2 = quizCreateRequest(user1Data.token, validQuizName + 'abc', validQuizDescription);
    const quiz2Data = JSON.parse(quiz2.body.toString());
    createQuizQuestionRequest(quiz2Data.quizId, user1Data.token, validCreateQuestion);

    const response = startNewSessionRequest(user1Data.token, quiz2Data.quizId, validAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(response.statusCode).toStrictEqual(HttpStatusCode.OK);
    expect(responseData).toStrictEqual({ sessionId: expect.any(Number) });
  });
});

describe('startNewSession - Error cases', () => {
  let user1: Response, user2: Response, quiz1: Response;
  beforeEach(() => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
  });
  test('invalid token', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());

    const response = startNewSessionRequest(user1Data.token + 1, quiz1Data.quizId, validAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  });
  test('QuizId not owned by this user', () => {
    user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user2.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());

    const response = startNewSessionRequest(user2Data.token, quiz1Data.quizId, validAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  });
  test('autoStartNum greater than 50', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());

    const response = startNewSessionRequest(user1Data.token, quiz1Data.quizId, invalidAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('10 sessions that are not in end state exist', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());

    // start 10 new sessions for quiz1
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
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('Quiz does not have any questions', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const quiz2 = quizCreateRequest(user1Data.token, validQuizName + 'abc', validQuizDescription);
    const quiz2Data = JSON.parse(quiz2.body.toString());
    const response = startNewSessionRequest(user1Data.token, quiz2Data.quizId, validAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
});
