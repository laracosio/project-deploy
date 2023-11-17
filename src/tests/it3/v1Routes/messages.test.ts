import { authRegisterRequest, clearRequest } from '../../it2/serverTestHelperIt2';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';
import { longMessage, msg1, msg2, msg3, noMsg, person1, validAutoStartNum, validQuestionInput1V2, validQuestionInput2V2, validQuestionInput3V2, validQuizDescription, validQuizName } from '../../../testingData';
import { createQuizQuestionRequestV2, joinGuestPlayerRequest, quizCreateRequestV2, sendMsgRequest, sessionCreateRequest, viewMsgsRequest } from '../../serverTestHelperIt3';
import { getUnixTime } from 'date-fns';
import { Response } from 'sync-request-curl';

const currentTime = getUnixTime(new Date());

let user1: Response, quiz1: Response, player1: Response, player2: Response, player3: Response, game1: Response;
beforeEach(() => {
  clearRequest();
  user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
  const user1Data = JSON.parse(user1.body.toString());
  quiz1 = quizCreateRequestV2(user1Data.token, validQuizName, validQuizDescription);
  const quiz1Data = JSON.parse(quiz1.body.toString());
  createQuizQuestionRequestV2(quiz1Data.quizId, user1Data.token, validQuestionInput1V2);
  createQuizQuestionRequestV2(quiz1Data.quizId, user1Data.token, validQuestionInput2V2);
  createQuizQuestionRequestV2(quiz1Data.quizId, user1Data.token, validQuestionInput3V2);
  game1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
  const game1Data = JSON.parse(game1.body.toString());
  player1 = joinGuestPlayerRequest(game1Data.sessionId, 'Gizmo');
  player2 = joinGuestPlayerRequest(game1Data.sessionId, 'Pumpkin');
  player3 = joinGuestPlayerRequest(game1Data.sessionId, 'Dave');
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
          timeSent: expect.any(Number)
        }
      ]
    });
    expect(data.messages[0].timeSent).toBeGreaterThanOrEqual(currentTime);
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
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
          timeSent: expect.any(Number)
        },
        {
          messageBody: msg2.messageBody,
          playerId: player2Data.playerId,
          playerName: 'Pumpkin',
          timeSent: expect.any(Number),
        },
        {
          messageBody: msg3.messageBody,
          playerId: player3Data.playerId,
          playerName: 'Dave',
          timeSent: expect.any(Number),
        }
      ]
    });
    expect(data.messages[0].timeSent).toBeGreaterThanOrEqual(currentTime);
    expect(data.messages[1].timeSent).toBeGreaterThanOrEqual(currentTime);
    expect(data.messages[2].timeSent).toBeGreaterThanOrEqual(currentTime);
    expect(res.statusCode).toStrictEqual(HttpStatusCode.OK);
  });
});

describe('GET v1/player/:playerid/chat - error', () => {
  test('playerId does not exist', async () => {
    const player1Data = JSON.parse(player1.body.toString());
    sendMsgRequest(player1Data.playerId, msg1);

    const res = viewMsgsRequest(player1Data.playerId * 1531);
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
  });
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
  });
});

describe('POST /v1/player/:playerid/chat - error', () => {
  test('invalid playerId', () => {
    const player1Data = JSON.parse(player1.body.toString());
    const res = sendMsgRequest((player1Data.playerId * 1531), msg1);
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
    const player1Data = JSON.parse(player1.body.toString());
    const res = sendMsgRequest(player1Data.playerId, longMessage);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
});
