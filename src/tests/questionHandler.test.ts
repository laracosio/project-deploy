import { authLoginRequest, clearRequest, authRegisterRequest, quizCreateRequest, createQuizQuestionRequest } from './serverTestHelper';
import { person1, person2 } from '../testingData';

beforeEach(() => {
  clearRequest();
});

//TODO
describe('Successful tests: Create a quiz question', () => {
  test.only('Create a Quiz Question test', () => {
    clearRequest();
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    console.log("This is the token: ", personLoginParsed.token);
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed.token, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    console.log("This is the quizId:", quizIdParsed.quizId);
    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
    const res = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, questionCreate);

    const data =  JSON.parse(res.body.toString());
    console.log(data);
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
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
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
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras bestest boy cat who has short term memory lost but still the best in the world  ?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(Number) });
  });
  test('Unsuccessful (400): The question has more than 6 answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Zuko', correct: false },
      { answer: 'Katara', correct: false },
      {answer: 'Aamg', correct: false},
      { answer: 'Toph', correct: false },
      { answer: 'Ty lee', correct: false },
      { answer: 'Sokka', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(Number) });
  });
  test('Unsuccessful (400): The question has less than 2 answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(Number) });
  });
  test('Unsuccessful (400): The question duration is not a positive number', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: -1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(Number) });
  });
  test('Unsuccessful (400): The sum of the question durations in the quiz exceeds 3 minutes', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 190,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(Number) });
  });
  test('Unsuccessful (400): The points awarded for the question are less than 1', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 10,
      points: 0,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(Number) });
  });
  test('Unsuccessful (400): The points awarded for the question are  greater than 10', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 11,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(Number) });
  });
  test('Unsuccessful (400): The length of any answer is shorter than 1 character long', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: '', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(Number) });
  });
  test('Unsuccessful (400): The length of any answer is longer than 30 characters long', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'HamitochondriaHamsterHamletHammyBoy', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(Number) });
  });
  test('Unsuccessful (400): Any answer strings are duplicates of one another', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(Number) });
  });
  test('Unsuccessful (400):There are no correct answers', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: false},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ error: expect.any(Number) });
  });
});

describe('Unsuccessful tests (401): Create a quiz question', () => {
  test('Unsuccesful (401): 	Token is empty', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = '';
    const personLoginParsed = JSON.parse(personLogin.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ questionId: expect.any(Number) });
  });
  test('Unsuccesful (401): 	Token does not refer to valid logged in user session', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = '35802taylor341';
    const personLoginParsed = JSON.parse(personLogin.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ questionId: expect.any(Number) });
  });
});

describe('Unsuccessful tests (403): Create a quiz question', () => {
  test('Unsuccesful (403): Valid token is provided, but user is not an owner of this quiz', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const person2Reg = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const person2Login = authLoginRequest(person2.email, person2.password);
    const person2LoginParsed = JSON.parse(person2Login.body.toString());
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answerCreate = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionCreate = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answerCreate,
    }
  
    const res = createQuizQuestionRequest(person2LoginParsed, quizIdParsed, questionCreate);

    const data = res.body;
    expect(data).toStrictEqual({ questionId: expect.any(Number) });
  });

});