import { authRegisterRequest, clearRequest, quizCreateRequest, quizRemoveRequest, quizViewTrashRequest, quizRestoreTrashRequest } from './serverTestHelper';
import { person1, person2, person3, person4, person5, validQuizName, validQuizDescription } from '../testingData';
import { Response } from 'sync-request-curl';

beforeEach(() => {
  clearRequest();
});

// quizViewTrash tests
describe('quizViewTrash - Success Cases', () => {
  let session1: Response, quiz1: Response, trashedQuiz1: Response;
  test('valid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    trashedQuiz1 = quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizViewTrashRequest(session1Data.token);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({
      trash: [
        {
          quizId: quiz1Data.quizId,
          name: 'My Quiz 1'
        },  
      ]
    });
  });
});

describe('quizViewTrash - Error Cases', () => {
  let session1: Response, quiz1: Response, trashedQuiz1: Response;
  test('invalid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    trashedQuiz1 = quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizViewTrashRequest(session1Data.token + 1);
    expect(response.statusCode).toStrictEqual(401);
  });
});

// quizRestoreTrash tests
describe('quizRestoreTrash - Success Cases', () => {
  let session1: Response, quiz1: Response, trashedQuiz1: Response;
  test('valid token, quizId', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    trashedQuiz1 = quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizRestoreTrashRequest(session1Data.token, quiz1Data.quizId);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
});

describe('quizRestoreTrash - Error Cases', () => {
  let session1: Response, session2: Response, quiz1: Response, quiz2: Response, trashedQuiz1: Response;
  test('invalid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    trashedQuiz1 = quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizRestoreTrashRequest(session1Data.token + 1, quiz1Data.quizId);
    expect(response.statusCode).toStrictEqual(401);
  });
  test('QuizId not owned by this user', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    session2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const session2Data = JSON.parse(session2.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    trashedQuiz1 = quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizRestoreTrashRequest(session2Data.token, quiz1Data.quizId);
    expect(response.statusCode).toStrictEqual(403);
  });
  test('Name already in use by other active quiz', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    trashedQuiz1 = quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    quiz2 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const response = quizRestoreTrashRequest(session1Data.token, quiz1Data.quizId);
    expect(response.statusCode).toStrictEqual(400);
  });
  test('QuizId not in trash', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizRestoreTrashRequest(session1Data.token, quiz1Data.quizId);
    expect(response.statusCode).toStrictEqual(400);
  });
});