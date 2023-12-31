import { Response } from 'sync-request';
import { person1, validAutoStartNum, validQuestionInput1, validQuestionInput2, validQuestionInput3, validQuizDescription, validQuizName } from '../../../testingData';
import { createQuizQuestionRequestV2, joinGuestPlayerRequest, playerFinalResultRqst, playerQuestResultRqst, playerSubmitAnswerRequest, quizCreateRequestV2, quizInfoRequestV2, sessionCreateRequest, updateSessionRequest } from '../../serverTestHelperIt3';
import { AdminActions } from '../../../enums/AdminActions';
import { authRegisterRequest, clearRequest } from '../../it2/serverTestHelperIt2';
import { Question } from '../../../dataStore';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';

let user1: Response, quiz1: Response, player1: Response, player2: Response, player3: Response;
let game1: Response, quizInfo: Response;
let question1: Question, question2: Question;

beforeEach(async() => {
  clearRequest();
  // create admin
  user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
  const user1Data = JSON.parse(user1.body.toString());
  // create quiz and add 3 questions
  quiz1 = quizCreateRequestV2(user1Data.token, validQuizName, validQuizDescription);
  const quiz1Data = JSON.parse(quiz1.body.toString());
  createQuizQuestionRequestV2(quiz1Data.quizId, user1Data.token, validQuestionInput1);
  createQuizQuestionRequestV2(quiz1Data.quizId, user1Data.token, validQuestionInput2);
  createQuizQuestionRequestV2(quiz1Data.quizId, user1Data.token, validQuestionInput3);
  // create session and add 3 players
  game1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
  const game1Data = JSON.parse(game1.body.toString());
  player1 = joinGuestPlayerRequest(game1Data.sessionId, 'Gizmo');
  player2 = joinGuestPlayerRequest(game1Data.sessionId, 'Dave');
  player3 = joinGuestPlayerRequest(game1Data.sessionId, 'Pumpkin');
  const player1Data = JSON.parse(player1.body.toString());
  const player2Data = JSON.parse(player2.body.toString());
  const player3Data = JSON.parse(player3.body.toString());
  // start game and by-pass countdown
  updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
  updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);

  // quizInfo to get answerIds
  quizInfo = quizInfoRequestV2(user1Data.token, quiz1Data.quizId);
  const quizInfoData = JSON.parse(quizInfo.body.toString());
  question1 = quizInfoData.questions[0];
  // players submit answers to Q1
  await new Promise((resolve) => setTimeout(resolve, 100));
  let numArray = [question1.answers[0].answerId];
  playerSubmitAnswerRequest(player1Data.playerId, 1, numArray);

  await new Promise((resolve) => setTimeout(resolve, 100));
  numArray = [question1.answers[1].answerId];
  playerSubmitAnswerRequest(player2Data.playerId, 1, numArray);

  await new Promise((resolve) => setTimeout(resolve, 100));
  numArray = [question1.answers[0].answerId];
  playerSubmitAnswerRequest(player3Data.playerId, 1, numArray);
  // question is closed and changes to ANSWER_SHOW
  await new Promise((resolve) => setTimeout(resolve, 1000));
});

// get results for a particular question of a session a player is playing in
describe('GET /v1/player/:playerid/question/:questionposition/results - success', () => {
  beforeEach(async() => {
    const user1Data = JSON.parse(user1.body.toString());
    const game1Data = JSON.parse(game1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_ANSWER);
  });
  test('checking Q1 details', () => {
    const player1Data = JSON.parse(player1.body.toString());
    const res = playerQuestResultRqst(player1Data.playerId, 1);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      questionId: question1.questionId,
      playersCorrectList: expect.any(Array),
      averageAnswerTime: expect.any(Number),
      percentCorrect: Math.round((2 / 3) * 100)
    });
    expect(data.playersCorrectList).toEqual(expect.arrayContaining(['Pumpkin', 'Gizmo']));
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  });
  test('check Q2 details', async () => {
    const user1Data = JSON.parse(user1.body.toString());
    const game1Data = JSON.parse(game1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const player1Data = JSON.parse(player1.body.toString());
    const player2Data = JSON.parse(player2.body.toString());
    const player3Data = JSON.parse(player3.body.toString());
    const quizInfoData = JSON.parse(quizInfo.body.toString());
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);

    question2 = quizInfoData.questions[1];

    await new Promise((resolve) => setTimeout(resolve, 100));
    let numArray: number[] = [question2.answers[2].answerId];
    playerSubmitAnswerRequest(player3Data.playerId, 2, numArray);

    await new Promise((resolve) => setTimeout(resolve, 200));
    numArray = [question2.answers[0].answerId];
    playerSubmitAnswerRequest(player1Data.playerId, 2, numArray);

    await new Promise((resolve) => setTimeout(resolve, 100));
    numArray = [question2.answers[3].answerId];
    playerSubmitAnswerRequest(player2Data.playerId, 2, numArray);

    // close question
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_ANSWER);

    const res = playerQuestResultRqst(player1Data.playerId, 2);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      questionId: question2.questionId,
      playersCorrectList: ['Pumpkin'],
      averageAnswerTime: expect.any(Number),
      percentCorrect: Math.round((1 / 3) * 100)
    });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  });
});

describe('GET /v1/player/:playerid/question/:questionposition/results - error', () => {
  test('invalid playerId', () => {
    const game1Data = JSON.parse(game1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const user1Data = JSON.parse(user1.body.toString());
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_ANSWER);
    const player3Data = JSON.parse(player3.body.toString());
    const res = playerQuestResultRqst(player3Data.playerId + 1531, 1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('question position doesnt exist (< 0)', () => {
    const game1Data = JSON.parse(game1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const user1Data = JSON.parse(user1.body.toString());
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_ANSWER);
    const player3Data = JSON.parse(player3.body.toString());
    const res = playerQuestResultRqst(player3Data.playerId, -1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('question position doesnt exist (exceeds #Questions)', () => {
    const game1Data = JSON.parse(game1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const user1Data = JSON.parse(user1.body.toString());
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_ANSWER);
    const player3Data = JSON.parse(player3.body.toString());
    const res = playerQuestResultRqst(player3Data.playerId, 5);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('session is not in ANSWER_SHOW state', () => {
    const player3Data = JSON.parse(player3.body.toString());
    const res = playerQuestResultRqst(player3Data.playerId, 1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('session isnt up to the input question', () => {
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
    const user1Data = JSON.parse(user1.body.toString());
    const game1Data = JSON.parse(game1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const player1Data = JSON.parse(player1.body.toString());
    const player2Data = JSON.parse(player2.body.toString());
    const player3Data = JSON.parse(player3.body.toString());
    const quizInfoData = JSON.parse(quizInfo.body.toString());
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);

    question2 = quizInfoData.questions[1];

    await new Promise((resolve) => setTimeout(resolve, 100)); // 0.1 second submission
    // jest.setTimeout(7000);
    let numArray: number[] = [question2.answers[2].answerId];
    playerSubmitAnswerRequest(player3Data.playerId, 2, numArray);

    await new Promise((resolve) => setTimeout(resolve, 200)); // 0.3 second submission
    numArray = [question2.answers[0].answerId];
    playerSubmitAnswerRequest(player1Data.playerId, 2, numArray);

    await new Promise((resolve) => setTimeout(resolve, 100)); // 0.4 second submission
    numArray = [question2.answers[3].answerId];
    playerSubmitAnswerRequest(player2Data.playerId, 2, numArray);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_FINAL_RESULTS);
  });
  test('ended question', () => {
    const quizInfoData = JSON.parse(quizInfo.body.toString());
    const question3 = quizInfoData.questions[2];
    const player1Data = JSON.parse(player1.body.toString());
    const res = playerFinalResultRqst(player1Data.playerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      usersRankedByScore: [
        {
          name: 'Pumpkin',
          score: 8.5
        },
        {
          name: 'Gizmo',
          score: 5
        },
        {
          name: 'Dave',
          score: 0
        },
      ],
      questionResults: [
        {
          questionId: question1.questionId,
          playersCorrectList: expect.any(Array),
          averageAnswerTime: expect.any(Number),
          percentCorrect: Math.round((2 / 3) * 100)
        },
        {
          questionId: question2.questionId,
          playersCorrectList: ['Pumpkin'],
          averageAnswerTime: expect.any(Number),
          percentCorrect: Math.round((1 / 3) * 100)
        },
        {
          questionId: question3.questionId,
          playersCorrectList: [],
          averageAnswerTime: 0,
          percentCorrect: 0
        }
      ]
    });
    expect(data.questionResults[0].playersCorrectList).toEqual(expect.arrayContaining(['Pumpkin', 'Gizmo']));
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  });
});

describe('GET /v1/player/:playerid/results - error', () => {
  beforeEach(async() => {
    const user1Data = JSON.parse(user1.body.toString());
    const game1Data = JSON.parse(game1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const player1Data = JSON.parse(player1.body.toString());
    const player2Data = JSON.parse(player2.body.toString());
    const player3Data = JSON.parse(player3.body.toString());
    const quizInfoData = JSON.parse(quizInfo.body.toString());
    // Q1 computed at beforeEach in test. Move to Q2 now
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);

    question2 = quizInfoData.questions[1];

    await new Promise((resolve) => setTimeout(resolve, 100));
    let numArray: number[] = [question2.answers[2].answerId];
    playerSubmitAnswerRequest(player3Data.playerId, 2, numArray);

    await new Promise((resolve) => setTimeout(resolve, 200));
    numArray = [question2.answers[0].answerId];
    playerSubmitAnswerRequest(player1Data.playerId, 2, numArray);

    await new Promise((resolve) => setTimeout(resolve, 100));
    numArray = [question2.answers[3].answerId];
    playerSubmitAnswerRequest(player2Data.playerId, 2, numArray);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
  test('invalid playerId', () => {
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const game1Data = JSON.parse(game1.body.toString());
    const user1Data = JSON.parse(user1.body.toString());
    updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_FINAL_RESULTS);
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
