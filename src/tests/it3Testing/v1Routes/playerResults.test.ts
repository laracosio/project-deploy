// remove me and add your tests below
test('placeholder', () => {
  expect((1 + 1)).toBe(2);
});


import { Response } from 'sync-request-curl';
import { authRegisterRequest, clearRequest, quizInfoRequest } from '../../it2Testing/serverTestHelperIt2';
import { person1, validQuestionInput1, validQuestionInput2, validQuestionInput3, validQuizDescription, validQuizName } from '../../../testingData';
import { createQuizQuestionRequestV2, quizCreateRequestV2 } from '../../serverTestHelperIt3';
import { AdminActions } from '../../../enums/AdminActions';

/**
let session1: Response, quiz1: Response, player1: Response, player2: Response, player3: Response;
let game1: Response, quizInfo: Response;
beforeEach(() => {
  clearRequest();
  session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
  const sess1Data = JSON.parse(session1.body.toString());
  quiz1 = quizCreateRequestV2(sess1Data.token, validQuizName, validQuizDescription);
  const quiz1Data = JSON.parse(quiz1.body.toString());
  createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
  createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
  createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput3);
  const game1 = sessionStart(quiz1Data.quizId, sess1Data.token, game1body);
  const game1Data = JSON.parse(game1.body.toString());
  const player1 = playerJoin(game1body.sessionId, 'Gizmo');
  const player1Data = JSON.parse(player1.body.toString());
  const player2 = playerJoin(game1body.sessionId, 'Pumpkin');
  const player2Data = JSON.parse(player2.body.toString());
  const player3 = playerJoin(game1body.sessionId, 'Dave');
  const player3Data = JSON.parse(player3.body.toString());
  updateSession(quiz1Data.quizId, game1body.sessionId, sess1Data.token, AdminActions.NEXT_QUESTION);
  updateSession(quiz1Data.quizId, game1body.sessionId, sess1Data.token, AdminActions.SKIP_COUNTDOWN);
  const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
  const quizInfoData = JSON.parse(quizInfo.body.toString());
  const question1 = quizInfoData.questions.question[0];
  answerQuestion(question1.answers[0].answerId, player1Data.playerId, 0);
  answerQuestion(question1.answers[1].answerId, player2Data.playerId, 0);
  answerQuestion(question1.answers[2].answerId, player3Data.playerId, 0);
  updateSession(quiz1Data.quizId, game1body.sessionId, sess1Data.token, AdminActions.GO_TO_ANSWER);
});

// get results for a particular question of a session a player is playing in
describe('GET /v1/player/:playerid/question/:questionposition/results - success', () => {
  test('checking Q1 details', () => {
    // call playerQuestionResults - check against return values 
    // {
    //   'questionId':,
    //   'playersCorrectList':,
    //   'averageAnswerTime':,
    //   'percentCorrect': 
    // }
    // 
  })
  test('check Q3 details', () => {
    // admin skips Q2
    // skips countdown
    // players submit answers - add timer
    // admin changes to answerShow state
  })  
})

describe('GET /v1/player/:playerid/question/:questionposition/results - error', () => {
  test('invalid playerId', () => {

  });
  test('invalid 4th player', () => {

  });
  test('question position doesnt exist (< 0)', () => {

  });
  test('question position doesnt exist (exceeds #Questions)', () => {

  });
  test('session is not in ANSWER_SHOW state', () => {

  });
  test('session isnt on the input question', () => {

  })
})

// Get the final results for a whole session a player is playing in
describe('GET /v1/player/:playerid/results - success', () => {
  beforeEach(() => {
    // play game to completion
  })
  test('ended question', () => {
    // admin calls final results
  }) 
})

describe('GET /v1/player/:playerid/results - error', () => {
  test('invalid playerId', () => {
    // try access results with player 4 who does not exist
  }) 
  test('not in final results stage', () => {
    // call route prior to admin calling final results
  })
})

*/


