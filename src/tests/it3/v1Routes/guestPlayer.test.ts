import { authRegisterRequest, authLoginRequest } from "../../it2/serverTestHelperIt2";
import { quizCreateRequestV2, createQuizQuestionRequestV2 } from "../../serverTestHelperIt3";
import { person1, validQuizName, validQuizDescription, validCreateQuestionV2PNG } from "../../../testingData";
import { joinGuestPlayerRequest, GuestPlayerStatusRequest } from "../../serverTestHelperIt3";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";
import { Player, Session } from "../../../dataStore";
import { SessionStates } from "../../../enums/SessionStates";
import fs from 'fs';
import { setData, getData } from "../../../dataStore";
import { setAndSave } from "../../../services/otherService";
import { clearRequest } from "../../it2/serverTestHelperIt2";
import { register } from "module";

beforeEach(() => {
  clearRequest();
});

describe('Successful tests: Join Guest Player', () => {
  test.only('Join Guest Player: Valid name', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequestV2(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
    
    const jsonString = `{
      "users"": [
        {
          "userId": 1,
          "nameFirst": 'Homer',
          "nameLast": 'Simpson',
          "password": 'ab726845e127efbdfa40adb618105ac8ef3314144252b30c54180fb90423c73d',
          "oldPasswords": [],
          "email": 'h.simpson@springfield.com',
          "numSuccessfulLogins": 2,
          "numFailedPasswordsSinceLastLogin": 0
        }
      ],
      "quizzes": [
        {
          "quizId": 1,
          "name": 'My Quiz 1',
          "timeCreated": 1699715665,
          "timeLastEdited": 1699715667,
          "description": 'This quiz is awesome',
          "quizOwner": 1,
          "numQuestions": 1,
          "questions": [Put object here],
          "quizDuration": 1
        }
      ],
      "mapUT": [
        { "token": '6518dcee-48c5-4cae-81e1-6aab83ef715d', "userId": 1 },
        { "token": '2ae64195-fa31-42d2-85a7-6b0b1bcfeb9c', "userId": 1 }
      ],
      "trash": [],
      "sessions": [],
      "mapPS": [],
      "maxQuizId": 1,
      "maxPlayerId": 0
    }`

    console.log(jsonString)
    const dataStore = JSON.parse(jsonString);
    setData(dataStore);


    const mockPlayer: Player = {
      playerId: 1,
      playerName: 'laraMichelle',
    }
    const mockSession: Session =  {
      sessionId: 123,
      sessionQuiz: quizIdParsed,
      sessionState: SessionStates.LOBBY,
      autoStartNum: 2,
      atQuestion: 0,
      sessionPlayers: [mockPlayer],
      messages: []
    }

    dataStore.sessions.push(mockSession);
    dataStore.maxPlayerId = 0;
    console.log('dataStore in testing:', dataStore);

    const name = "laraCosio";
    const res = joinGuestPlayerRequest(123, name);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ playerId: expect.any(Number) });
    expect(res.statusCode).toBe(HttpStatusCode.OK);
  });
});
 /*
describe('Successful tests: Join Guest Player', () => {
  test.only('Join Guest Player: Valid name', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequestV2(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);

    const dataStore = getData();
    const mockPlayer: Player = {
      playerId: 1,
      playerName: 'laraMichelle',
    }
    const mockSession: Session =  {
      sessionId: 123,
      sessionQuiz: quizIdParsed,
      sessionState: SessionStates.LOBBY,
      autoStartNum: 2,
      atQuestion: 0,
      sessionPlayers: [mockPlayer],
      messages: []
    }

    dataStore.sessions.push(mockSession);
    dataStore.maxPlayerId = 0;
    setAndSave(dataStore);
    console.log('dataStore in testing:', dataStore);

    const name = "laraCosio";
    const res = joinGuestPlayerRequest(123, name);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ playerId: expect.any(Number) });
    expect(res.statusCode).toBe(HttpStatusCode.OK);
  });
  test('Join Guest Player: Empty String', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequestV2(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
    
    const dataStore = getData();

    const mockPlayer: Player = {
      playerId: 1,
      playerName: 'laraMichelle',
    }

    const mockSession: Session =  {
      sessionId: 123,
      sessionQuiz: quizIdParsed,
      sessionState: SessionStates.LOBBY,
      autoStartNum: 2,
      atQuestion: 0,
      sessionPlayers: [mockPlayer],
      messages: []
    }

    dataStore.sessions.push(mockSession);
    dataStore.maxPlayerId = 2;
    setAndSave(dataStore);
    

    const name = "";
    const res = joinGuestPlayerRequest(123, name);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ playerId: expect.any(Number) });
    expect(res.statusCode).toBe(HttpStatusCode.OK);
  });
});


describe('Unsuccessful tests: Join Guest Player', () => {
  test('Unsuccessful: Name of user entered is not unique', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequestV2(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
    
    const dataStore = getData();

    const mockPlayer: Player = {
      playerId: 1,
      playerName: 'laraMichelle',
    }

    const mockSession: Session =  {
      sessionId: 123,
      sessionQuiz: quizIdParsed,
      sessionState: SessionStates.LOBBY,
      autoStartNum: 2,
      atQuestion: 0,
      sessionPlayers: [mockPlayer],
      messages: []
    }
    dataStore.sessions.push(mockSession);
    dataStore.maxPlayerId = 1;
    setAndSave(dataStore);
    
    const name = "laraMichelle";
    const res = joinGuestPlayerRequest(123, name);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
  test('Unsuccessful: Session is not in LOBBY state', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequestV2(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
    
    const dataStore = getData();
    const mockSession: Session =  {
      sessionId: 123,
      sessionQuiz: quizIdParsed,
      sessionState: SessionStates.END,
      autoStartNum: 2,
      atQuestion: 0,
      sessionPlayers: [],
      messages: []
    }

    dataStore.sessions.push(mockSession);
    dataStore.maxPlayerId = 2;
    setAndSave(dataStore);

    const name = "lara michelle";
    const res = joinGuestPlayerRequest(123, name);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
});
/*
describe('Successful tests: Status of Guest Player', () => {
  test('Status of Guest Player: Valid playerId', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequestV2(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
    
    //change this
    const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, { autoStartNum: 3 });
    const sessionQuizParsed = JSON.parse(sessionQuiz.body.toString());
    
    const name = "lara cosio";
    const joinGuestPlayer = joinGuestPlayerRequest(sessionQuizParsed, name);
    const joinGuestPlayerParsed = JSON.parse(joinGuestPlayer.body.toString());

    //mock here
    const res = GuestPlayerStatusRequest(joinGuestPlayerParsed.playerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({
      "state": "LOBBY",
      "numQuestions": expect.any(Number),
      "atQuestion": expect.any(Number)
    });
    expect(res.statusCode).toBe(HttpStatusCode.OK);
  });
});

describe('Unsuccessful tests: Status of Guest Player', () => {
  test('Status of Guest Player: invalid playerId', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequestV2(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
    
    //change this
    const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, { autoStartNum: 3 });
    const sessionQuizParsed = JSON.parse(sessionQuiz.body.toString());
    
    const name = "lara cosio";
    
    const joinGuestPlayer = joinGuestPlayerRequest(sessionQuizParsed, name);
    const joinGuestPlayerParsed = JSON.parse(joinGuestPlayer.body.toString());

    //mock here

    const res = GuestPlayerStatusRequest(joinGuestPlayerParsed.playerId + 10);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
});

*/