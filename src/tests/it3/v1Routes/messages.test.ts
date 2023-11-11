import { authRegisterRequest, clearRequest } from '../../it2/serverTestHelperIt2';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';
import { longMessage, msg1, msg2, msg3, noMsg, person1, validQuestionInput1, validQuestionInput2, validQuestionInput3, validQuizDescription, validQuizName } from '../../../testingData';
import { createQuizQuestionRequestV2, quizCreateRequestV2, sendMsgRequest, setDataRequest, viewMsgsRequest } from '../../serverTestHelperIt3';
import { getUnixTime } from 'date-fns';
import { unitTestLobby } from '../../../testingUnitTestLobby';
import { Response } from 'sync-request-curl';

const PLAYER_1 = 1;
const PLAYER_2 = 2;
const PLAYER_3 = 3;

const currentTime = getUnixTime(new Date());

beforeEach(() => {
  clearRequest();
  setDataRequest(unitTestLobby);
});

describe('POST /v1/player/:playerid/chat - success', () => {
  test('send 1 message', () => {
    const res = sendMsgRequest(PLAYER_1, msg1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  });
  test('send multiple messages', () => {
    sendMsgRequest(PLAYER_1, msg1);
    sendMsgRequest(PLAYER_2, msg2);
    const res = sendMsgRequest(PLAYER_3, msg3);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  });
});

describe('POST /v1/player/:playerid/chat - error', () => {
  test('invalid playerId', () => {
    const res = sendMsgRequest(1531, msg1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('message too short', () => {
    const res = sendMsgRequest(PLAYER_1, noMsg);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('message too long', () => {
    const res = sendMsgRequest(PLAYER_1, longMessage);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
});

describe('GET v1/player/:playerid/chat - success', () => {
  test('1 sent message', () => {
    sendMsgRequest(PLAYER_1, msg1);
    const res = viewMsgsRequest(PLAYER_2);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      messages: [
        {
          messageBody: msg1.messageBody,
          playerId: PLAYER_1,
          playerName: 'Ella',
          timeSent: expect.any(Number)
        }
      ]
    });
    expect(data.messages[0].timeSent).toBeGreaterThanOrEqual(currentTime);
  });
  test('multiple sent messages', async () => {
    sendMsgRequest(PLAYER_1, msg1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    sendMsgRequest(PLAYER_2, msg2);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    sendMsgRequest(PLAYER_3, msg3);
    const res = viewMsgsRequest(PLAYER_1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      messages: [
        {
          messageBody: msg1.messageBody,
          playerId: PLAYER_1,
          playerName: 'Ella',
          timeSent: currentTime
        },
        {
          messageBody: msg2.messageBody,
          playerId: PLAYER_2,
          playerName: 'Frank',
          timeSent: currentTime + 1,
        },
        {
          messageBody: msg3.messageBody,
          playerId: PLAYER_3,
          playerName: 'Tony',
          timeSent: currentTime + 2,
        }
      ]
    });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  });
});

describe('GET v1/player/:playerid/chat - error', () => {
  test('playerId does not exist', () => {
    sendMsgRequest(PLAYER_1, msg1);
    sendMsgRequest(PLAYER_2, msg2);
    sendMsgRequest(PLAYER_3, msg3);
    const res = viewMsgsRequest(1531);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
});

/**
 * 
REMOVE COMMENTS ONCE newSessionRequest is made and playerjoin

let session1: Response, quiz1: Response, player1: Response, player2: Response, player3: Response, game1: Response;
beforeEach(() => {
  clearRequest();
  session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
  const sess1Data = JSON.parse(session1.body.toString());
  quiz1 = quizCreateRequestV2(sess1Data.token, validQuizName, validQuizDescription);
  const quiz1Data = JSON.parse(quiz1.body.toString());
  createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
  createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
  createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput3);
  game1 = startNewSessionRequest(sess1Data.token, quiz1Data.quizId, validAutoStartNum);
  const game1Data = JSON.parse(game1.body.toString());
  player1 = playerJoinRequest(game1Data.sessionId, 'Gizmo');
  player2 = playerJoinRequest(game1Data.sessionId, 'Pumpkin');
  player3 = playerJoinRequest(game1Data.sessionId, 'Dave');
});

// view messages
describe('GET v1/player/:playerid/chat - success', () => {
  test('1 sent message', () => {
    const player1Data = JSON.parse(player1.body.toString());
    sendMsgRequest(player1Data.playerId, msg1);
    const player2Data = JSON.parse(player2.body.toString());
    const res = viewMsgsRequest(player2Data.playerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      messages: [
        {
          messageBody: msg1.messageBody,
          playerId: player1Data.playerId,
          playerName: 'Gizmo',
          timeSent: currentTime
        }
      ]
    });
  });
  test('multiple sent messages', async () => {
    const player1Data = JSON.parse(player1.body.toString());
    sendMsgRequest(player1Data.playerId, msg1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const player2Data = JSON.parse(player2.body.toString());
    sendMsgRequest(player2Data.playerId, msg2);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const player3Data = JSON.parse(player3.body.toString());
    sendMsgRequest(player3Data.playerId, msg3);
    const res = viewMsgsRequest(player1Data.playerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      messages: [
        {
          messageBody: msg1.messageBody,
          playerId: player1Data.playerId,
          playerName: 'Gizmo',
          timeSent: currentTime
        },
        {
          messageBody: msg2.messageBody,
          playerId: player2Data.playerId,
          playerName: 'Pumpkin',
          timeSent: currentTime + 1,
        },
        {
          messageBody: msg3.messageBody,
          playerId: player3Data.playerId,
          playerName: 'Dave',
          timeSent: currentTime + 2,
        }
      ]
    });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  });
});

describe('GET v1/player/:playerid/chat - error', () => {
  test('playerId does not exist', async () => {
    const player1Data = JSON.parse(player1.body.toString());
    sendMsgRequest(player1Data.playerId, msg1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const player2Data = JSON.parse(player2.body.toString());
    sendMsgRequest(player2Data.playerId, msg2);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const player3Data = JSON.parse(player3.body.toString());
    sendMsgRequest(player3Data.playerId, msg3);
    
    const res = viewMsgsRequest(player3Data.playerId * 1531);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
});

// send messages
describe('POST /v1/player/:playerid/chat - success', () => {
  test('send 1 message', () => {
    const player1Data = JSON.parse(player1.body.toString());
    const res = sendMsgRequest(player1Data.playerId, msg1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  })
  test('send multiple messages', () => {
    const player1Data = JSON.parse(player1.body.toString());
    const player2Data = JSON.parse(player2.body.toString());
    const player3Data = JSON.parse(player3.body.toString());
    sendMsgRequest(player1Data.playerId, msg1);
    sendMsgRequest(player2Data.playerId, msg2);
    const res = sendMsgRequest(player3Data.playerId, msg3);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  })
})

describe('POST /v1/player/:playerid/chat - error', () => {
  test('invalid playerId', () => {
    const player3Data = JSON.parse(player3.body.toString());
    const res = sendMsgRequest((player3Data.playerId * 1531), msg1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('message too short', () => {
    const player1Data = JSON.parse(player1.body.toString());
    const res = sendMsgRequest(player1Data.playerId, noMsg);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('message too long', () => {
    const player1Data = JSON.parse(player1.body.toString())
    const res = sendMsgRequest(player1Data.playerId, longMessage);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
});

*/