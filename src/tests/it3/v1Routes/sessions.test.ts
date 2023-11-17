import { clearRequest, authRegisterRequest, quizCreateRequest, createQuizQuestionRequest } from '../../it2/serverTestHelperIt2';
import { person1, person2, validQuizDescription, validQuizName, validCreateQuestion, validAutoStartNum, invalidAutoStartNum } from '../../../testingData';
import { sessionCreateRequest, viewSessionsRequest, updateSessionRequest } from '../../serverTestHelperIt3';
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

    const response = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
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
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);

    const response = sessionCreateRequest(user1Data.token, quiz2Data.quizId, validAutoStartNum);
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

    const response = sessionCreateRequest(user1Data.token + 1, quiz1Data.quizId, validAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  });
  test('QuizId not owned by this user', () => {
    user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user2.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());

    const response = sessionCreateRequest(user2Data.token, quiz1Data.quizId, validAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  });
  test('autoStartNum greater than 50', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());

    const response = sessionCreateRequest(user1Data.token, quiz1Data.quizId, invalidAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('10 sessions that are not in end state exist', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());

    // start 10 new sessions for quiz1
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);

    const response = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('Quiz does not have any questions', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const quiz2 = quizCreateRequest(user1Data.token, validQuizName + 'abc', validQuizDescription);
    const quiz2Data = JSON.parse(quiz2.body.toString());
    const response = sessionCreateRequest(user1Data.token, quiz2Data.quizId, validAutoStartNum);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({ error: expect.any(String) });
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
});

// viewSessions tests
describe('viewSessions - Success Cases', () => {
  let user1: Response, session1: Response, session2: Response, session3: Response, session4: Response, quiz1: Response;
  test('1 active session listed', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    session1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const session1Data = JSON.parse(session1.body.toString());
    const response = viewSessionsRequest(user1Data.token, quiz1Data.quizId);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({
      activeSessions: [
        session1Data.sessionId
      ],
      inactiveSessions: [

      ],
    });
  });

  test('1 inactive session listed', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    session1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const session1Data = JSON.parse(session1.body.toString());
    updateSessionRequest(user1Data.token, quiz1Data.quizId, session1Data.sessionId, 'END');
    const response = viewSessionsRequest(user1Data.token, quiz1Data.quizId);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({
      activeSessions: [],
      inactiveSessions: [
        session1Data.sessionId
      ]
    });
  });

  test('Multiple active and inactive sessions listed', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    session1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const session1Data = JSON.parse(session1.body.toString());
    updateSessionRequest(user1Data.token, quiz1Data.quizId, session1Data.sessionId, 'END');
    session2 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const session2Data = JSON.parse(session2.body.toString());
    updateSessionRequest(user1Data.token, quiz1Data.quizId, session2Data.sessionId, 'END');
    session3 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const session3Data = JSON.parse(session3.body.toString());
    session4 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const session4Data = JSON.parse(session4.body.toString());
    const response = viewSessionsRequest(user1Data.token, quiz1Data.quizId);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({
      activeSessions: [
        session3Data.sessionId,
        session4Data.sessionId,
      ],
      inactiveSessions: [
        session1Data.sessionId,
        session2Data.sessionId,
      ],
    });
  });
});

describe('viewSessions - Error Cases', () => {
  let user1:Response, user2: Response, quiz1: Response;
  test('invalid token', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const response = viewSessionsRequest(user1Data.token + 1, quiz1Data.quizId);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  });

  test('QuizId not owned by this user - view 1 active session', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user2.body.toString());
    const response = viewSessionsRequest(user2Data.token, quiz1Data.quizId);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  });

  test('QuizId not owned by this user - view 1 inactive session', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user2.body.toString());
    const response = viewSessionsRequest(user2Data.token, quiz1Data.quizId);
    expect(response.statusCode).toStrictEqual(403);
  });
});
