import { authLoginRequest, clearRequest, authRegisterRequest, quizCreateRequest, createQuizQuestionRequest, moveQuestionRequest, quizInfoRequest, updateQuizQuestionRequest } from './serverTestHelper';
import { person1, person2, validQuestionInput1, validQuestionInput2, validQuizDescription, validQuizName } from '../testingData';
import { Response } from 'sync-request-curl';
import { getUnixTime } from 'date-fns';

beforeEach(() => {
  clearRequest();
});

// create Question - Lara
describe('Successful tests: Create a quiz question', () => {
  test('Create a Quiz Question test', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ questionId: expect.any(Number) });
  });
});

describe('Unsuccessful tests (400): Create a quiz question', () => {
  test('Unsuccessful (400): Question string is less than 5 characters in length', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): Question string is greater than 50 characters in length', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras bestest boy cat who has short term memory lost but still the best in the world  ?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The question has more than 6 answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Zuko', correct: false },
      { answer: 'Katara', correct: false },
      { answer: 'Aamg', correct: false },
      { answer: 'Toph', correct: false },
      { answer: 'Ty lee', correct: false },
      { answer: 'Sokka', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The question has less than 2 answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true }
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Unsuccessful (400): The question duration is not a positive number', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: -1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The sum of the question durations in the quiz exceeds 3 minutes', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 190,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The points awarded for the question are less than 1', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 10,
      points: 0,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The points awarded for the question are  greater than 10', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 11,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The length of any answer is shorter than 1 character long', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: '', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The length of any answer is longer than 30 characters long', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'HamitochondriaHamsterHamletHammyBoy', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): Any answer strings are duplicates of one another', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400):There are no correct answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Unsuccessful tests (401): Create a quiz question', () => {
  test('Unsuccesful (401): Token is empty', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const invalidToken = '';
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, invalidToken, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (401): Token does not refer to valid logged in user session', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const invalidToken = 'gj138914TAYLOR23852';
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, invalidToken, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Unsuccessful tests (403): Create a quiz question', () => {
  test('Unsuccesful (403): Valid token is provided, but user is not an owner of this quiz', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const person2Login = authLoginRequest(person2.email, person2.password);
    const person2LoginParsed = JSON.parse(person2Login.body.toString());
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const res = createQuizQuestionRequest(quizIdParsed.quizId, person2LoginParsed.token, questionCreate);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

describe('PUT /v1/admin/quiz/{quizid}/question/{questionid}/move - Success', () => {
  let sess1: Response, quiz1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
  });
  test('Move Question 2 to new Position and check lastEdited', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});

    const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    expect(JSON.parse(quizInfo.body.toString()).timeLastEdited).toBeGreaterThanOrEqual(getUnixTime(new Date()));
    // check hard coded params
  });
});

describe('PUT /v1/admin/quiz/{quizid}/question/{questionid}/move - Error', () => {
  let sess1: Response, quiz1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
  });
  test('Quiz ID does not refer to a valid quiz', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId + 1, quest2Data.questionId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Question Id does not refer to a valid question within this quiz', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId + 1, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('NewPosition is less than 0', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId, -1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('NewPosition is greater than n-1 where n is the number of questions', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId, 4);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('NewPosition is the position of the current question', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId, 1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Token is empty', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest('', quiz1Data.quizId, quest2Data.questionId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });
  // test('Token is invalid (does not refer to valid logged in user session)', () => {
  //   const sess1Data = JSON.parse(sess1.body.toString());
  //   const quiz1Data = JSON.parse(quiz1.body.toString());
  //   const quest1 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
  //   const quest1Data = JSON.parse(quest1.body.toString());
  //   const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
  //   const quest2Data = JSON.parse(quest2.body.toString());
  //   // needs log out session1
  //   const res = moveQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId, 0);
  //   const data = JSON.parse(res.body.toString());
  //   expect(data).toStrictEqual({ error: expect.any(String) });
  //   expect(res.statusCode).toStrictEqual(401);
  // });
  test('Valid token is provided, but user is not an owner of this quiz', () => {
    const sess2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const sess2Data = JSON.parse(sess2.body.toString());
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequest(sess2Data.token, quiz1Data.quizId, quest2Data.questionId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(403);
  });
});

//updateQuestion
describe('Successful tests: Update a quiz question', () => {
  test('Update a quiz question test', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false }
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 1,
      points: 2,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
  });
});

describe('Unsuccessful tests (400): Update a quiz question', () => {
  test('Unsuccesful (400): Question Id does not refer to a valid question within this quiz', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const invalidCreateQuestion = 42;

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false }
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 1,
      points: 2,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, invalidCreateQuestion, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): Question string is less than 5 characters in length', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false }
    ];

    const questionCreateUpdate = {
      question: 'Who',
      duration: 1,
      points: 2,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): Question string is greater than 50 characters in length', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false }
    ];

    const questionCreateUpdate = {
      question: 'Who is laras bestest baby girl cat meowmeow who brings in snakes and frogs and salamanders inside the house?',
      duration: 1,
      points: 2,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The question has more than 6 answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false },
      { answer: 'Haru', correct: false },
      { answer: 'Nami', correct: false },
      { answer: 'Blossom', correct: false },
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 1,
      points: 2,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The question has less than 2 answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Coco', correct: true }
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 1,
      points: 2,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The question duration is not a positive number', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false },
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: -1,
      points: 2,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false },
    ];

    const questionCreateUpdate = {
      question: 'Who is laras bestest baby girl cat meowmeow who brings in snakes and frogs and salamanders inside the house?',
      duration: 190,
      points: 2,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The points awarded for the question are less than 1', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false },
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 10,
      points: 0,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The points awarded for the question are more than 10', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false },
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 10,
      points: 153,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The length of any answer is shorter than 1 character long', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: '', correct: false },
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 10,
      points: 153,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): The length of any answer is longer than 30 character long', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'CocoCokesCokieCocoGirl Aling Maliit Best Girl Very Loving', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false },
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 10,
      points: 153,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): Any answer strings are duplicates of one another (within the same question)', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Frankie', correct: false },
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 10,
      points: 153,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (400): There are no correct answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false },
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 10,
      points: 153,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
describe('Unsuccessful tests (401): Update a quiz question', () => {
  test('Unsuccesful (401): Token is empty', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const invalidToken = '';
    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false }
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 1,
      points: 2,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, invalidToken, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccesful (401): Token is invalid (does not refer to valid logged in user session)', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const invalidToken = 'gj138914TAYLOR23852';
    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false }
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 1,
      points: 2,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, invalidToken, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
describe('Unsuccessful tests (403): Update a quiz question', () => {
  test('Unsuccesful (403): Valid token is provided, but user is unauthorised to complete this action', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const person2Login = authLoginRequest(person2.email, person2.password);
    const person2LoginParsed = JSON.parse(person2Login.body.toString());

    const answerCreate = [
      { answer: 'Hamlet', correct: true },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ];

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    };

    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());
    const answerCreateUpdate = [
      { answer: 'Hamlet', correct: false },
      { answer: 'Coco', correct: true },
      { answer: 'Bob', correct: false },
      { answer: 'Frankie', correct: false }
    ];

    const questionCreateUpdate = {
      question: 'Who is laras best girl cat?',
      duration: 1,
      points: 2,
      answers: answerCreateUpdate,
    };

    const res = updateQuizQuestionRequest(quizIdParsed.quizId, createQuestionParsed.questionId, person2LoginParsed.token, questionCreateUpdate);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
