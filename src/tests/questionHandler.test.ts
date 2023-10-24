import { authLoginRequest, clearRequest, authRegisterRequest, quizCreateRequest, createQuizQuestionRequest, duplicateQuestionRequest, quizInfoRequest } from './serverTestHelper';
import { person1, person2, validQuestionInput1, validQuestionInput2, validQuestionInput3, validQuizDescription, validQuizName } from '../testingData';
import { Response } from 'sync-request-curl';

beforeEach(() => {
  clearRequest();
});

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

// duplicate Question - needs createQuestion
describe('POST /v1/admin/quiz/{quizid}/question/{questionid}/duplicate - Error', () => {
  let sess1: Response, quiz1: Response, quest1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quest1 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
  });
  test('Duplicate question successfully', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ newQuestionId: expect.any(Number) });
    const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    const infoData = JSON.parse(quizInfo.body.toString());
    expect(infoData.questions[1]).toStrictEqual(
      {
        questionId: data.newQuestionId,
        question: validQuestionInput1.question,
        duration: validQuestionInput1.duration,
        points: validQuestionInput1.points,
        answers: [
          {
            answerId: expect.any(Number),
            answer: validQuestionInput1.answers[0].answer,
            correct: validQuestionInput1.answers[0].correct,
            colour: expect.any(String)
          },
          {
            answerId: expect.any(Number),
            answer: validQuestionInput1.answers[1].answer,
            correct: validQuestionInput1.answers[1].correct,
            colour: expect.any(String)
          },
          {
            answerId: expect.any(Number),
            answer: validQuestionInput1.answers[2].answer,
            correct: validQuestionInput1.answers[2].correct,
            colour: expect.any(String)
          },
          {
            answerId: expect.any(Number),
            answer: validQuestionInput1.answers[3].answer,
            correct: validQuestionInput1.answers[3].correct,
            colour: expect.any(String)
          }
        ]
      }
    );
  });
  // test('Remove twice duplicated question', () => {
  //   const sess1Data = JSON.parse(sess1.body.toString());
  //   const quiz1Data = JSON.parse(quiz1.body.toString());
  //   const quest1Data = JSON.parse(quest1.body.toString());
  //   const firstDupQ = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
  //   const firstDupQData = JSON.parse(firstDupQ.body.toString());
  //   const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
  //   const data = JSON.parse(res.body.toString());
  //   expect(data).toStrictEqual({ newQuestionId: expect.any(Number) });
  //   // remove first duplicated question. second duplicate to remain
  //   questionRemoveRequest(sess1Data.token, quiz1Data.quizId, firstDupQData.questionId);

  //   const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
  //   expect(JSON.parse(quizInfo.body.toString())).toStrictEqual(
  //     {
  //       quizId: quiz1Data.quizId,
  //       name: validQuizName,
  //       timeCreated: expect.any(Number),
  //       timeLastEdited: expect.any(Number),
  //       description: validQuizDescription,
  //       numQuestions: 2,
  //       questions: [
  //         {
  //           questionId: quest1Data.quizId,
  //           question: validQuestionInput1.question,
  //           duration: validQuestionInput1.duration,
  //           points: validQuestionInput1.points,
  //           answers: validQuestionInput1.answers
  //         },
  //         {
  //           questionId: data.quizId,
  //           question: validQuestionInput1.question,
  //           duration: validQuestionInput1.duration,
  //           points: validQuestionInput1.points,
  //           answers: validQuestionInput1.answers
  //         }
  //       ],
  //       duration: (validQuestionInput1.duration * 2)
  //     }
  //   );
  // });
  test('duplicateQuestion appears immediately after', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput3);
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest2Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ newQuestionId: expect.any(Number) });

    const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    expect(JSON.parse(quizInfo.body.toString())).toStrictEqual(
      {
        quizId: quiz1Data.quizId,
        name: validQuizName,
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: validQuizDescription,
        numQuestions: 4,
        questions: expect.any(Array),
        duration: ((validQuestionInput1.duration) + (validQuestionInput2.duration * 2) + (validQuestionInput3.duration))
      }
    );
    expect(JSON.parse(quizInfo.body.toString()).questions[2]).toStrictEqual(
      {
        questionId: data.newQuestionId,
        question: validQuestionInput2.question,
        duration: validQuestionInput2.duration,
        points: validQuestionInput2.points,
        answers: [
          {
            answerId: expect.any(Number),
            answer: validQuestionInput2.answers[0].answer,
            correct: validQuestionInput2.answers[0].correct,
            colour: expect.any(String)
          },
          {
            answerId: expect.any(Number),
            answer: validQuestionInput2.answers[1].answer,
            correct: validQuestionInput2.answers[1].correct,
            colour: expect.any(String)
          },
          {
            answerId: expect.any(Number),
            answer: validQuestionInput2.answers[2].answer,
            correct: validQuestionInput2.answers[2].correct,
            colour: expect.any(String)
          },
          {
            answerId: expect.any(Number),
            answer: validQuestionInput2.answers[3].answer,
            correct: validQuestionInput2.answers[3].correct,
            colour: expect.any(String)
          }
        ]
      }
    );
  });
});

describe('POST /v1/admin/quiz/{quizid}/question/{questionid}/duplicate - Error', () => {
  let sess1: Response, sess2: Response, quiz1: Response, quest1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    sess2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    quest1 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
  });
  test('invalid quizId', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId + 1, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('questionId is invalid for question', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId + 1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('token is empty', () => {
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest('', quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });
  // test('token belongs to a logged out session', () => {
  //   const sess1Data = JSON.parse(sess1.body.toString());
  //   const quiz1Data = JSON.parse(quiz1.body.toString());
  //   const quest1Data = JSON.parse(quest1.body.toString());
  //   quizLogoutRequest(sess1Data.token);
  //   const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
  //   const data = JSON.parse(res.body.toString());
  //   expect(data).toStrictEqual({ error: expect.any(String) });
  //   expect(res.statusCode).toStrictEqual(401);
  // });
  test('Valid token is provided but user is not an owner', () => {
    const sess2Data = JSON.parse(sess2.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess2Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(403);
  });
});
