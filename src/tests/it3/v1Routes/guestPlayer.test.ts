import { authRegisterRequest } from '../../it2/serverTestHelperIt2';
import { quizCreateRequest, createQuizQuestionRequest } from '../../it2/serverTestHelperIt2';
import { person1, validQuizName, validQuizDescription, validCreateQuestion, validAutoStartNum } from '../../../testingData';
import { guestPlayerStatusRequest, sessionCreateRequest } from '../../serverTestHelperIt3';
import { joinGuestPlayerRequest } from '../../serverTestHelperIt3';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';

import { clearRequest } from '../../it2/serverTestHelperIt2';

beforeEach(() => {
  clearRequest();
});

describe('Successful tests: Join Guest Player', () => {
  test('Join Guest Player: Valid name', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = 'laraCosio';
    const res = joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ playerId: expect.any(Number) });
    expect(res.statusCode).toBe(HttpStatusCode.OK);
  });
  test('Join Guest Player: Empty string name', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = '';
    const res = joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ playerId: expect.any(Number) });
    expect(res.statusCode).toBe(HttpStatusCode.OK);
  });
});

describe('Unsuccessful tests: Join Guest Player', () => {
  test('Unsuccessful: Name of user entered is not unique', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = 'laraMichelle';
    const name2 = 'laraMichelle';
    joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const res = joinGuestPlayerRequest(sesh1Data.sessionId, name2);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
  /*
  test('Unsuccessful: Session is not in LOBBY state', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = "laraMichelle";
    //put updatesessionStateRequest here!
    const res = joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
  */
});

describe('Successful tests: Status of Guest Player', () => {
  test('Status of Guest Player: Valid playerId', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = 'laraCosio';
    const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const player1Data = JSON.parse(player1.body.toString());

    const res = guestPlayerStatusRequest(player1Data.playerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      state: expect.any(String),
      numQuestions: expect.any(Number),
      atQuestion: expect.any(Number)
    });
    expect(res.statusCode).toBe(HttpStatusCode.OK);
  });
});

describe('Unsuccessful tests: Status of Guest Player', () => {
  test('Status of Guest Player: invalid playerId', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = 'laraCosio';
    joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const invalidPlayerId = 6;
    const res = guestPlayerStatusRequest(invalidPlayerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
});
