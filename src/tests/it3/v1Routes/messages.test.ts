import { unitTestLobby } from '../../../testingDataUnit';
import { clearRequest } from '../../it2/serverTestHelperIt2';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';
import { longMessage, msg1, msg2, msg3, noMsg } from '../../../testingData';
import { sendMsgRequest, setDataRequest, viewMsgsRequest } from '../../serverTestHelperIt3';
import { getUnixTime } from 'date-fns';

const PLAYER_1 = 1;
const PLAYER_2 = 2;
const PLAYER_3 = 3;

const currentTime = getUnixTime(new Date());

beforeEach(() => {
  clearRequest();
  setDataRequest(unitTestLobby);
});

describe('GET /v1/player/:playerid/chat - success', () => {
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

describe('GET /v1/player/:playerid/chat - error', () => {
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
  test('multiple sent messages', () => {
    sendMsgRequest(PLAYER_1, msg1);
    sendMsgRequest(PLAYER_2, msg2);
    sendMsgRequest(PLAYER_3, msg3);
    const res = viewMsgsRequest(PLAYER_1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      messages: [
        {
          messageBody: msg1.messageBody,
          playerId: PLAYER_1,
          playerName: 'Ella',
          timeSent: expect.any(Number)
        },
        {
          messageBody: msg2.messageBody,
          playerId: PLAYER_2,
          playerName: 'Frank',
          timeSent: expect.any(Number),
        },
        {
          messageBody: msg3.messageBody,
          playerId: PLAYER_3,
          playerName: 'Tony',
          timeSent: expect.any(Number)
        }
      ]
    });
    expect(data.messages[2].timeSent).toBeGreaterThanOrEqual(currentTime);
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
let session1: Response, quiz1: Response, player1: Response, player2: Response, player3: Response;
let game1: Response;
beforeEach(() => {
  clearRequest();
  session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
  const sess1Data = JSON.parse(authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast).body.toString());
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
