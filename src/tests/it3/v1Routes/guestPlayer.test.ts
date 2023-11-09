// remove me and add your tests below
test('placeholder', () => {
  expect((1 + 1)).toBe(2);
});


/*
describe('Successful tests: Join Guest Player', () => {
  test('Join Guest Player: Valid name', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuizQuestion = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
  const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, {autoStartNum: 3});
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
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuizQuestion = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
  const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, {autoStartNum: 3});
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
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuizQuestion = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
  const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, {autoStartNum: 3});
  const sessionQuizParsed = JSON.parse(sessionQuiz.body.toString());
  const name = "lara cosio";
  const first = joinGuestPlayerRequest(sessionQuizParsed, name);
      const res = joinGuestPlayerRequest(sessionQuizParsed, name);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
  test('Unsuccessful: Session is not in LOBBY state', () => {
TODO!
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuizQuestion = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
  const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, {autoStartNum: 3});
  const sessionQuizParsed = JSON.parse(sessionQuiz.body.toString());
  const name = "lara";
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
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuizQuestion = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
  const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, {autoStartNum: 3});
  const sessionQuizParsed = JSON.parse(sessionQuiz.body.toString());
  const name = "lara cosio";
  const joinGuestPlayer = joinGuestPlayerRequest(sessionQuizParsed, name);
    Const joinGuestPlayerParsed = JSON.parse(joinGuestPlayer.body.toString);
    const res = GuestPlayerStatusRequest(joinGuestPlayerParsed.playerId)
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
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuizQuestion = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
	const sessionQuiz = startNewQuizSessionRequest(quizIdParsed, personLoginParsed, {autoStartNum: 3});
	const sessionQuizParsed = JSON.parse(sessionQuiz.body.toString());
	const name = "lara cosio";
	const joinGuestPlayer = joinGuestPlayerRequest(sessionQuizParsed, name);
    Const joinGuestPlayerParsed = JSON.parse(joinGuestPlayer.body.toString);
    const res = GuestPlayerStatusRequest(joinGuestPlayerParsed.playerId+10)
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
});

*/