import { authRegisterRequest, authLoginRequest } from "../../it2/serverTestHelperIt2";
import { quizCreateRequestV2, createQuizQuestionRequestV2 } from "../../serverTestHelperIt3";
import { person1, validQuizName, validQuizDescription, validCreateQuestionV2PNG } from "../../../testingData";
import { joinGuestPlayerRequest, GuestPlayerStatusRequest } from "../../serverTestHelperIt3";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";
// remove me and add your tests below
test('placeholder', () => {
  expect((1 + 1)).toBe(2);
});



describe('Successful tests: Join Guest Player', () => {
  test('Join Guest Player: Valid name', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequestV2(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuizQuestion = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);

    //CHANGE THIS
    const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, { autoStartNum: 3 });
    const sessionQuizParsed = JSON.parse(sessionQuiz.body.toString());


    const name = "lara cosio";
    const res = joinGuestPlayerRequest(sessionQuizParsed, name);
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
    const createQuizQuestion = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
    
    //change this
    const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, { autoStartNum: 3 });
    const sessionQuizParsed = JSON.parse(sessionQuiz.body.toString());
    
    
    const name = "";
    const res = joinGuestPlayerRequest(sessionQuizParsed, name);
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
    
    //changer this
    const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, { autoStartNum: 3 });
    const sessionQuizParsed = JSON.parse(sessionQuiz.body.toString());
    
    const name = "lara michelle";
    const first = joinGuestPlayerRequest(sessionQuizParsed, name);
    const res = joinGuestPlayerRequest(sessionQuizParsed, name);
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
    
    //change this
    const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, { autoStartNum: 3 });
    const sessionQuizParsed = JSON.parse(sessionQuiz.body.toString());
    
    const name = "lara michelle";
    const res = joinGuestPlayerRequest(sessionQuizParsed, name);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(HttpStatusCode.OK);
  });
});

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

