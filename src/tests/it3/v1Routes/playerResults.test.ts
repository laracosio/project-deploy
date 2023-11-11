import { Response } from 'sync-request-curl';

import { person1, validAutoStartNum, validQuestionInput1, validQuestionInput1V2, validQuestionInput2, validQuestionInput2V2, validQuestionInput3, validQuestionInput3V2, validQuizDescription, validQuizName } from '../../../testingData';
import { createQuizQuestionRequestV2, quizCreateRequestV2, quizInfoRequestV2, sessionCreateRequest } from '../../serverTestHelperIt3';
import { AdminActions } from '../../../enums/AdminActions';
import { authRegisterRequest, clearRequest } from '../../it2/serverTestHelperIt2';
import { Question } from '../../../dataStore';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';

let session1: Response, quiz1: Response, player1: Response, player2: Response, player3: Response;
let game1: Response, quizInfo: Response, question1: Question, question2: Question;
beforeEach(() => {
  clearRequest();
});

// get results for a particular question of a session a player is playing in
// 1dp: https://stackoverflow.com/questions/7342957/how-do-you-round-to-one-decimal-place-in-javascript
describe('GET /v1/player/:playerid/question/:questionposition/results - success', () => {
  beforeEach(async() => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequestV2(sess1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput3);
    const game1 = sessionCreateRequest(sess1Data.token, quiz1Data.quizId, validAutoStartNum);
    const game1Data = JSON.parse(game1.body.toString());
    const player1 = playerJoinRequest(game1Data.sessionId, 'Gizmo');
    const player2 = playerJoinRequest(game1Data.sessionId, 'Dave');
    const player3 = playerJoinRequest(game1Data.sessionId, 'Pumpkin');
    const player1Data = JSON.parse(player1.body.toString());
    const player2Data = JSON.parse(player2.body.toString());
    const player3Data = JSON.parse(player3.body.toString());
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);
    const quizInfo = quizInfoRequestV2(sess1Data.token, quiz1Data.quizId);
    const quizInfoData = JSON.parse(quizInfo.body.toString());
    const question1 = quizInfoData.questions.question[0];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[1].answerId, player1Data.playerId, 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[0].answerId, player2Data.playerId, 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[0].answerId, player3Data.playerId, 0);
    // does this need a promise for duration of Q?
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_ANSWER);
  });
  test('checking Q1 details', () => {
    const player1Data = JSON.parse(player1.body.toString());
    const res = playerQuestResultRqst(player1Data.playerId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      questionId: question1.questionId,
      playersCorrectList: ['Dave', 'Pumpkin'],
      averageAnswerTime: Math.round((1 + 3 + 2) / 3),
      percentCorrect: Math.round(2 / 3)
    });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  });
  test('check Q2 details', () => {
    const sess1Data = JSON.parse(session1.body.toString());
    const game1Data = JSON.parse(game1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const player1Data = JSON.parse(player1.body.toString());
    const player2Data = JSON.parse(player2.body.toString());
    const player3Data = JSON.parse(player3.body.toString());
    const quizInfoData = JSON.parse(quizInfo.body.toString());
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);
    const question2 = quizInfoData.questions.question[1];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question2.answers[2].answerId, player1Data.playerId, 1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question2.answers[2].answerId, player2Data.playerId, 1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question2.answers[3].answerId, player3Data.playerId, 1);
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_ANSWER);

    const res = playerQuestResultRqst(player1Data.playerId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      questionId: question2.questionId,
      playersCorrectList: ['Gizmo', 'Pumpkin'],
      averageAnswerTime: Math.round((1 + 3 + 2) / 3),
      percentCorrect: Math.round(2 / 3)
    });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  });
});

describe('GET /v1/player/:playerid/question/:questionposition/results - error', () => {
  beforeEach(async() => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequestV2(sess1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput3);
    const game1 = sessionCreateRequest(sess1Data.token, quiz1Data.quizId, validAutoStartNum);
    const game1Data = JSON.parse(game1.body.toString());
    const player1 = playerJoinRequest(game1Data.sessionId, 'Gizmo');
    const player2 = playerJoinRequest(game1Data.sessionId, 'Dave');
    const player3 = playerJoinRequest(game1Data.sessionId, 'Pumpkin');
    const player1Data = JSON.parse(player1.body.toString());
    const player2Data = JSON.parse(player2.body.toString());
    const player3Data = JSON.parse(player3.body.toString());
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);
    const quizInfo = quizInfoRequestV2(sess1Data.token, quiz1Data.quizId);
    const quizInfoData = JSON.parse(quizInfo.body.toString());
    const question1 = quizInfoData.questions.question[0];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[1].answerId, player1Data.playerId, 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[0].answerId, player2Data.playerId, 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[0].answerId, player3Data.playerId, 0);
  });
  test('invalid playerId', () => {
    const game1Data = JSON.parse(game1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const sess1Data = JSON.parse(session1.body.toString());
    // does this need a promise for duration of Q?
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_ANSWER);
    const player3Data = JSON.parse(player3.body.toString());
    const res = playerQuestResultRqst(player3Data.playerId + 1531, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('question position doesnt exist (< 0)', () => {
    // does this need a promise for duration of Q?
    const game1Data = JSON.parse(game1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const sess1Data = JSON.parse(session1.body.toString());
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_ANSWER);
    const player3Data = JSON.parse(player3.body.toString());
    const res = playerQuestResultRqst(player3Data.playerId, -1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('question position doesnt exist (exceeds #Questions)', () => {
    // does this need a promise for duration of Q?
    const game1Data = JSON.parse(game1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const sess1Data = JSON.parse(session1.body.toString());
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_ANSWER);
    const player3Data = JSON.parse(player3.body.toString());
    const res = playerQuestResultRqst(player3Data.playerId, 5);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('session is not in ANSWER_SHOW state', () => {
    const player3Data = JSON.parse(player3.body.toString());
    const res = playerQuestResultRqst(player3Data.playerId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('session isnt on the input question', () => {
    const player3Data = JSON.parse(player3.body.toString());
    const res = playerQuestResultRqst(player3Data.playerId, 2);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
});

// Get the final results for a whole session a player is playing in
describe('GET /v1/player/:playerid/results - success', () => {
  beforeEach(async() => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequestV2(sess1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput1V2);
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput2V2);
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput3V2);
    const game1 = sessionCreateRequest(sess1Data.token, quiz1Data.quizId, validAutoStartNum);
    const game1Data = JSON.parse(game1.body.toString());
    const player1 = playerJoinRequest(game1Data.sessionId, 'Gizmo');
    const player2 = playerJoinRequest(game1Data.sessionId, 'Dave');
    const player3 = playerJoinRequest(game1Data.sessionId, 'Pumpkin');
    const player1Data = JSON.parse(player1.body.toString());
    const player2Data = JSON.parse(player2.body.toString());
    const player3Data = JSON.parse(player3.body.toString());
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);
    const quizInfo = quizInfoRequestV2(sess1Data.token, quiz1Data.quizId);
    const quizInfoData = JSON.parse(quizInfo.body.toString());
    question1 = quizInfoData.questions.question[0];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[1].answerId, player1Data.playerId, 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[0].answerId, player2Data.playerId, 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[0].answerId, player3Data.playerId, 0);
    await new Promise((resolve) => setTimeout(resolve, question1.duration));
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);
    question2 = quizInfoData.questions.question[1];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question2.answers[2].answerId, player1Data.playerId, 1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question2.answers[2].answerId, player2Data.playerId, 1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question2.answers[3].answerId, player3Data.playerId, 1);
    await new Promise((resolve) => setTimeout(resolve, question2.duration));
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_FINAL_RESULTS);
  });
  test('ended question', () => {
    const player1Data = JSON.parse(player1.body.toString());
    const res = playerFinalResultRqst(player1Data.playerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      usersRankedByScore: [
        {
          name: 'Pumpkin',
          score: 8
        },
        {
          name: 'Gizmo',
          score: 6
        },
        {
          name: 'Dave',
          score: 3
        },
      ],
      questionResults: [
        {
          questionId: question1.questionId,
          playersCorrectList: ['Gizmo', 'Pumpkin'],
          averageAnswerTime: Math.round((1 + 3 + 2) / 3),
          percentCorrect: Math.round(2 / 3)
        },
        {
          questionId: question2.questionId,
          playersCorrectList: ['Gizmo', 'Pumpkin'],
          averageAnswerTime: Math.round((1 + 3 + 2) / 3),
          percentCorrect: Math.round(2 / 3)
        }
      ]
    });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  });
});

describe('GET /v1/player/:playerid/results - error', () => {
  beforeEach(async() => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequestV2(sess1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput1V2);
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput2V2);
    createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput3V2);
    const game1 = sessionCreateRequest(sess1Data.token, quiz1Data.quizId, validAutoStartNum);
    const game1Data = JSON.parse(game1.body.toString());
    const player1 = playerJoinRequest(game1Data.sessionId, 'Gizmo');
    const player2 = playerJoinRequest(game1Data.sessionId, 'Dave');
    const player3 = playerJoinRequest(game1Data.sessionId, 'Pumpkin');
    const player1Data = JSON.parse(player1.body.toString());
    const player2Data = JSON.parse(player2.body.toString());
    const player3Data = JSON.parse(player3.body.toString());
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);
    const quizInfo = quizInfoRequestV2(sess1Data.token, quiz1Data.quizId);
    const quizInfoData = JSON.parse(quizInfo.body.toString());
    question1 = quizInfoData.questions.question[0];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[1].answerId, player1Data.playerId, 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[0].answerId, player2Data.playerId, 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question1.answers[0].answerId, player3Data.playerId, 0);
    await new Promise((resolve) => setTimeout(resolve, question1.duration));
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);
    question2 = quizInfoData.questions.question[1];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question2.answers[2].answerId, player1Data.playerId, 1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question2.answers[2].answerId, player2Data.playerId, 1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    answerQuestion(question2.answers[3].answerId, player3Data.playerId, 1);
    await new Promise((resolve) => setTimeout(resolve, question2.duration));
  });
  test('invalid playerId', () => {
    updateSessionRequest(sess1Data.sessionId, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_FINAL_RESULTS);
    const player3Data = JSON.parse(player3.body.toString());
    const res = playerFinalResultRqst(player3Data.playerId * 1531);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('not in final results stage', () => {
    const player3Data = JSON.parse(player3.body.toString());
    const res = playerFinalResultRqst(player3Data.playerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
});
