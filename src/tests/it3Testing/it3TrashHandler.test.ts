import { person1, validQuizDescription, validQuizName, stringOf1QuizIDs, stringOf2QuizIDs } from '../../testingData';
import { authRegisterRequest, clearRequest, quizCreateRequest } from '../it2Testing/serverTestHelperIt2';
import { Response } from 'sync-request-curl';
import { quizRemoveRequestV2, quizViewTrashRequestV2, quizRestoreTrashRequestV2, quizEmptyTrashRequestV2 } from '../serverTestHelperIt3';
// import { HttpStatusCode } from "../../enums/HttpStatusCode";

beforeEach(() => {
  clearRequest();
});

// quizRemove
describe('DELETE /v2/admin/quiz/{quizid}', () => {
  let sess1: Response, quiz1: Response;
  beforeEach(() => {
    const { email, password, nameFirst, nameLast } = person1;
    sess1 = authRegisterRequest(email, password, nameFirst, nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
  });
  test('Success - v2 route - 1 quiz created - 1 removed', () => {
    // needs to be updated to V2 when created
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1data = JSON.parse(quiz1.body.toString());
    const res = quizRemoveRequestV2(sess1Data.token, quiz1data.quizId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
  });
  // NEEDS AN OPEN SESSION - TEST AFTER SESSIONS HAVE BEEN CREATED!
  // test('tesing v2 route - open session', () => {
  //   const sess1Data = JSON.parse(sess1.body.toString());
  //   const quiz1data = JSON.parse(quiz1.body.toString());
  //   // open a session
  //   const res = quizRemoveRequestV2(sess1Data.token, quiz1data.quizId);
  //   const data = JSON.parse(res.body.toString());
  //   expect(data).toStrictEqual({ error: expect.any(String) });
  //   expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  // })
});

// quizViewTrash tests
describe('quizViewTrash - Success Cases', () => {
  let session1: Response, quiz1: Response;
  test('valid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequestV2(session1Data.token, quiz1Data.quizId);
    const response = quizViewTrashRequestV2(session1Data.token);
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

// quizRestoreTrash tests
describe('quizRestoreTrash - Success Cases', () => {
  let session1: Response, quiz1: Response;
  test('valid token, quizId', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequestV2(session1Data.token, quiz1Data.quizId);
    const response = quizRestoreTrashRequestV2(session1Data.token, quiz1Data.quizId);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
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
    quizRemoveRequestV2(session1Data.token, quiz1Data.quizId);
    const response = quizEmptyTrashRequestV2(session1Data.token, stringOf1QuizIDs);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
  test('2 quizzes in trash, remove 1 quiz', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequestV2(session1Data.token, quiz1Data.quizId);
    quiz2 = quizCreateRequest(session1Data.token, 'name2', validQuizDescription);
    const quiz2Data = JSON.parse(quiz2.body.toString());
    quizRemoveRequestV2(session1Data.token, quiz2Data.quizId);
    const response = quizEmptyTrashRequestV2(session1Data.token, stringOf1QuizIDs);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
  test('3 quizzes in trash, remove 2 quizzes', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, 'My Quiz 1', validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizRemoveRequestV2(session1Data.token, quiz1Data.quizId);
    quiz2 = quizCreateRequest(session1Data.token, 'My Quiz 2', validQuizDescription);
    const quiz2Data = JSON.parse(quiz2.body.toString());
    quizRemoveRequestV2(session1Data.token, quiz2Data.quizId);
    quiz3 = quizCreateRequest(session1Data.token, 'My Quiz 3', validQuizDescription);
    const quiz3Data = JSON.parse(quiz3.body.toString());
    quizRemoveRequestV2(session1Data.token, quiz3Data.quizId);
    const response = quizEmptyTrashRequestV2(session1Data.token, stringOf2QuizIDs);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
});
