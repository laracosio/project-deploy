// remove me and add your tests below
// test('placeholder', () => {
//   expect((1 + 1)).toBe(2);
// });

import { Response } from 'sync-request-curl';
import { setData } from '../../../dataStore';
import { unitTestLobby } from '../../../testingDataUnit';
import { clearRequest } from '../../it2/serverTestHelperIt2';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';
import { longMessage } from '../../../testingData';

beforeEach(() => {
  clearRequest();
  const dataStore = unitTestLobby;
  setData(unitTestLobby);
});

describe('GET /v1/player/:playerid/chat - success', () => {
  test('send 1 message', () => {
    const res = addMsgRequest(1, 'This is the first message');
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    expect(data.statusCode).toStrictEqual(200);
    // check all messages
  }) 
  test('send multiple messages', () => {
    addMsgRequest(1, 'This is the first message');
    addMsgRequest(2, 'This is the second message');
    const res = addMsgRequest(3, 'This is the third message');
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    expect(data.statusCode).toStrictEqual(200);
    // check all messages
  }) 
})

describe('GET /v1/player/:playerid/chat - error', () => {
  // add 1 message - get 4th player (not joined) to read message
  test('invalid playerId', () => {
    const res = addMsgRequest(1531, 'This is the first message');
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    expect(data.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('message too short', () => {
    const res = addMsgRequest(1, '');
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    expect(data.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('message too long', () => {
    const res = addMsgRequest(1, longMessage);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    expect(data.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
})


/**
let session1: Response, quiz1: Response, player1: Response, player2: Response, player3: Response;
let game1: Response;
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
});

describe('GET /v1/player/:playerid/chat - success', () => {
  test('send 1 message', () => {
    addMessages(playerId, 'This is the first message');
    // check all messages
  }) 
  test('send multiple messages', () => {
    addMessages(playerId, 'This is the first message');
    addMessages(playerId2, 'This is the second message');
    addMessages(playerId3, 'This is the third message');
    // check all messages
  }) 
})

describe('GET /v1/player/:playerid/chat - error', () => {
  // add 1 message - get 4th player (not joined) to read message
  test('send 1 message', () => {
    addMessages(playerId, 'This is the first message');
    checkmessages(someInvalidId)
  })
})

describe('POST /v1/player/:playerid/chat - success', () => {
  test('send 1 message', () => {
    addMessages(playerId, 'This is the first message');
    expect no issues
  }) 
  test('send multiple messages', () => {
    addMessages(playerId, 'This is the first message');
    addMessages(playerId2, 'This is the second message');
    addMessages(playerId3, 'This is the third message');
    expect no issues
  }) 
})

describe('POST /v1/player/:playerid/chat - error', () => {
  test('send 1 message', () => {
    addMessages(playerId3 + 1, 'This is the first message');
    expect to return 400
  }) 
  // empty message
  test('send 1 message', () => {
    addMessages(playerId, '');
    expect to return 400
  }) 
  test('send 1 message', () => {
    addMessages(playerId, include a very long message);
    expect to return 400
  }) 
})

*/
