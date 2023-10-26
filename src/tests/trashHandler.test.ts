import { authRegisterRequest, clearRequest, quizCreateRequest, quizRemoveRequest, quizViewTrashRequest, quizRestoreTrashRequest, quizEmptyTrashRequest } from './serverTestHelper';
import { person1, person2, validQuizName, validQuizDescription, stringOf1QuizIDs, stringOf2QuizIDs, stringOf3QuizIDs } from '../testingData';
import { Response } from 'sync-request-curl';

beforeEach(() => {
  clearRequest();
});

// quizViewTrash tests
describe('quizViewTrash - Success Cases', () => {
  let session1: Response, quiz1: Response;
  test('valid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizViewTrashRequest(session1Data.token);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1Data.quizId,
          name: 'My Quiz 1'
        },
      ]
    });
  });
});

describe('quizViewTrash - Error Cases', () => {
  let session1: Response, quiz1: Response;
  test('invalid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizViewTrashRequest(session1Data.token + 1);
    expect(response.statusCode).toStrictEqual(401);
  });
});

// quizRestoreTrash tests
describe('quizRestoreTrash - Success Cases', () => {
  let session1: Response, quiz1: Response;
  test('valid token, quizId', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizRestoreTrashRequest(session1Data.token, quiz1Data.quizId);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
});

describe('quizRestoreTrash - Error Cases', () => {
  let session1: Response, session2: Response, quiz1: Response;
  test('invalid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
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
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizRestoreTrashRequest(session2Data.token, quiz1Data.quizId);
    expect(response.statusCode).toStrictEqual(403);
  });
  test('Name already in use by other active quiz', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
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

// quizEmptyTrash tests
describe('quizEmptyTrash - Success Cases', () => {
  let session1: Response, quiz1: Response, quiz2: Response, quiz3: Response;
  test('1 quiz in trash, remove 1 quiz', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizEmptyTrashRequest(session1Data.token, stringOf1QuizIDs);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
  test('2 quizzes in trash, remove 1 quiz', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    quiz2 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz2Data = JSON.parse(quiz2.body.toString());
    quizRemoveRequest(session1Data.token, quiz2Data.quizId);
    const response = quizEmptyTrashRequest(session1Data.token, stringOf1QuizIDs);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
  test('3 quizzes in trash, remove 2 quizzes', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    quiz2 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz2Data = JSON.parse(quiz2.body.toString());
    quizRemoveRequest(session1Data.token, quiz2Data.quizId);
    quiz3 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz3Data = JSON.parse(quiz3.body.toString());
    quizRemoveRequest(session1Data.token, quiz3Data.quizId);
    const response = quizEmptyTrashRequest(session1Data.token, stringOf2QuizIDs);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
});

describe('quizEmptyTrash - Error Cases', () => {
  let session1: Response, session2: Response, quiz1: Response, quiz2: Response, quiz3: Response;
  test('invalid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizEmptyTrashRequest(session1Data.token + 1, stringOf1QuizIDs);
    expect(response.statusCode).toStrictEqual(401);
  });
  test('QuizId not owned by this user', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    session2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const session2Data = JSON.parse(session2.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    const response = quizEmptyTrashRequest(session2Data.token, stringOf1QuizIDs);
    expect(response.statusCode).toStrictEqual(403);
  });

  //Error tests for if one or more of the Quiz IDs is not currently in the trash
  test('QuizId not in trash', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizEmptyTrashRequest(session1Data.token, quiz1Data.quizId);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('1 out of 1 quizzes in string not currently in trash', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const response = quizEmptyTrashRequest(session1Data.token, stringOf1QuizIDs);
    expect(response.statusCode).toStrictEqual(400);
  });
  test('1 out of 2 quizzes in string not currently in trash', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequest(session1Data.token, quiz1Data.quizId);
    quiz2 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const response = quizEmptyTrashRequest(session1Data.token, stringOf2QuizIDs);
    expect(response.statusCode).toStrictEqual(400);
  });
  test('2 out of 2 quizzes in string not currently in trash', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    quiz2 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const response = quizEmptyTrashRequest(session1Data.token, stringOf2QuizIDs);
    expect(response.statusCode).toStrictEqual(400);
  });
});