// remove me and add your tests below
test('placeholder', () => {
  expect((1 + 1)).toBe(2);
});


import { Response } from 'sync-request-curl';
import { authRegisterRequest, clearRequest } from '../../it2Testing/serverTestHelperIt2';
import { person1, validQuestionInput1, validQuestionInput2, validQuestionInput3, validQuizDescription, validQuizName } from '../../../testingData';
import { createQuizQuestionRequestV2, quizCreateRequestV2 } from '../../serverTestHelperIt3';

let session1: Response, quiz1: Response, player1: Response, player2: Response, player3: Response;
beforeEach(() => {
  clearRequest();
  session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
  const sess1Data = JSON.parse(session1.body.toString());
  quiz1 = quizCreateRequestV2(sess1Data.token, validQuizName, validQuizDescription);
  const quiz1Data = JSON.parse(quiz1.body.toString());
  createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
  createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
  createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput3);
  // player 1 join
  // player 2 join
  // player 3 join
  // start new session
  // admin goes to update session to question countdown
  // admin goes to skip countdown
  // players submit answers - add timer
  // admin changes to answer show state
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
  // success case - check different outputs
  // success case 
})

describe('GET /v1/player/:playerid/results - error', () => {
  // invalid playerId
  // not in final results stage
})



