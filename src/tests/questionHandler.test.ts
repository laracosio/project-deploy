// // DELETE THIS LATER
import { authLoginRequest, clearRequest, authRegisterRequest, quizCreateRequest, createQuizQuestionRequest } from './serverTestHelper';
import { person1, person2, person3, validQuizDescription, validQuizName } from '../testingData';

beforeEach(() => {
  clearRequest();
});

//TODO
describe('Successful tests: Create a quiz question', () => {
  test('Create a Quiz Question test', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizName = 'My first quiz';
    const quizDescription = 'This is my first quiz';
    const quizId = quizCreateRequest(personLoginParsed, quizName, quizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const answer = [
      {answer: 'Hamlet', correct: true},
      { answer: 'Coco', correct: false },
      { answer: 'Bob', correct: false },
    ]

    const questionBody = {
      question: 'Who is laras best boy cat?',
      duration: 1,
      points: 2,
      answers: answer,
    }
  
    const res = createQuizQuestionRequest(personLoginParsed, quizIdParsed, questionBody);

    const data = res.body;
    expect(data).toStrictEqual({ questionId: expect.any(Number) });
  });
});
