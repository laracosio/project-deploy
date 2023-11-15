import { Response } from 'sync-request-curl';
import { longMultiChoice, person1, validAutoStartNum, validQuestionInput1, validQuestionInput2, validQuestionInput3, validQuizDescription, validQuizName } from '../../../testingData';
import { createQuizQuestionRequestV2, joinGuestPlayerRequest, playerFinalResultRqst, playerQuestResultRqst, playerSubmitAnswerRequest, quizCreateRequestV2, quizInfoRequestV2, sessionCreateRequest, updateSessionRequest } from '../../serverTestHelperIt3';
import { AdminActions } from '../../../enums/AdminActions';
import { authRegisterRequest, clearRequest } from '../../it2/serverTestHelperIt2';
import { Question } from '../../../dataStore';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';

// cannot keep with other playerResults tests due to beforeEach 
test('long multiple choice test to calculate avgTime', async() => {
  clearRequest();
  // create admin
  const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
  const user1Data = JSON.parse(user1.body.toString());
  // create quiz and add 3 questions
  const quiz1 = quizCreateRequestV2(user1Data.token, validQuizName, validQuizDescription);
  const quiz1Data = JSON.parse(quiz1.body.toString());
  createQuizQuestionRequestV2(quiz1Data.quizId, user1Data.token, longMultiChoice);
  // create session and add 3 players
  const game1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
  const game1Data = JSON.parse(game1.body.toString());
  const player1 = joinGuestPlayerRequest(game1Data.sessionId, 'Gizmo');
  const player2 = joinGuestPlayerRequest(game1Data.sessionId, 'Dave');
  const player3 = joinGuestPlayerRequest(game1Data.sessionId, 'Pumpkin');
  const player1Data = JSON.parse(player1.body.toString());
  const player2Data = JSON.parse(player2.body.toString());
  const player3Data = JSON.parse(player3.body.toString());
  // start game and by-pass countdown
  updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.NEXT_QUESTION);
  updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.SKIP_COUNTDOWN);

  // quizInfo to get answerIds
  const quizInfo = quizInfoRequestV2(user1Data.token, quiz1Data.quizId);
  const quizInfoData = JSON.parse(quizInfo.body.toString());
  const question1 = quizInfoData.questions[0];
  // players submit answers to Q1
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second
  let numArray = [question1.answers[0].answerId, question1.answers[1].answerId];
  playerSubmitAnswerRequest(player1Data.playerId, 1, numArray);

  await new Promise((resolve) => setTimeout(resolve, 1000)); // 2 second
  playerSubmitAnswerRequest(player2Data.playerId, 1, numArray);

  await new Promise((resolve) => setTimeout(resolve, 500)); // 3 second
  numArray = [question1.answers[0].answerId];
  playerSubmitAnswerRequest(player3Data.playerId, 1, numArray);
  // question is closed and changes to ANSWER_SHOW
  await new Promise((resolve) => setTimeout(resolve, 1000));
  updateSessionRequest(user1Data.token, quiz1Data.quizId, game1Data.sessionId, AdminActions.GO_TO_ANSWER);
  const res = playerQuestResultRqst(player1Data.playerId, 1);

  const data = JSON.parse(res.body.toString());
  expect(data).toStrictEqual({
    questionId: question1.questionId,
    playersCorrectList: expect.any(Array),
    averageAnswerTime: expect.any(Number),
    percentCorrect: Math.round((2 / 3) * 100)
  });
  expect(data.playersCorrectList).toEqual(expect.arrayContaining(['Dave', 'Gizmo']));
  expect(data.averageAnswerTime).toEqual(Math.round((1 + 2 + 3)/3));
  expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
})