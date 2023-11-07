import { person1, person2, person3, validQuizDescription, validQuizName, newvalidQuizName } from '../../testingData';
import { authRegisterRequest, clearRequest, quizCreateRequest, quizInfoRequest } from '../it2-testing/serverTestHelperIt2';
import { Response } from 'sync-request-curl';
import { quizRemoveRequestV2, quizTransferRequestV2, quizNameUpdateRequestV2, quizDescriptUpdateRequestV2, quizCreateRequestV2 } from '../serverTestHelperIt3';
import { getUnixTime } from 'date-fns';
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

// quizTransfer
describe('POST /v2/admin/quiz/{quizId}/transfer', () => {
  let sess1: Response, sess2: Response, quiz1: Response;
  beforeEach(() => {
    const { email, password, nameFirst, nameLast } = person1;
    sess1 = authRegisterRequest(email, password, nameFirst, nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    // route to be updated once quizCreate v2 made
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
    sess2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
  });
  test('success - transfer to from person1 to person2 and then to person3', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const sess2Data = JSON.parse(sess2.body.toString());
    const res = quizTransferRequestV2(sess1Data.token, quiz1Data.quizId, person2.email);
    expect(JSON.parse(res.body.toString())).toStrictEqual({});
    // route to be updated once v2 made
    const quizInfo1 = quizInfoRequest(sess2Data.token, quiz1Data.quizId);
    expect(quizInfo1.statusCode).toStrictEqual(200);
    expect(JSON.parse(quizInfo1.body.toString()).timeLastEdited).toBeGreaterThanOrEqual(getUnixTime(new Date()));

    const sess3 = authRegisterRequest(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const sess3Data = JSON.parse(sess3.body.toString());
    const res2 = quizTransferRequestV2(sess2Data.token, quiz1Data.quizId, person3.email);
    expect(JSON.parse(res2.body.toString())).toStrictEqual({});
    const trashQuiz = quizRemoveRequestV2(sess3Data.token, quiz1Data.quizId);
    expect(JSON.parse(trashQuiz.body.toString())).toStrictEqual({});
  });
  // NEEDS AN OPEN SESSION - TEST AFTER SESSIONS HAVE BEEN CREATED!
  // test('error - tesing v2 route - open session error', () => {
  //   const sess1Data = JSON.parse(sess1.body.toString());
  //   const quiz1Data = JSON.parse(quiz1.body.toString());
  //   const sess2Data = JSON.parse(sess2.body.toString());
  //   // open a session
  //   const res = quizTransferRequestV2(sess1Data.token, quiz1Data.quizId, person2.email);
  //   const data = JSON.parse(res.body.toString());
  //   expect(data).toStrictEqual({ error: expect.any(String) });
  //   expect(res.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  // })
});

// adminQuizNameUpdate tests
describe('adminQuizNameUpdate - Success Cases', () => {
  let session1: Response, quiz1: Response;
  test('valid authUserId, quizId and name', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizNameUpdateRequestV2(session1Data.token, quiz1Data.quizId, newvalidQuizName);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
});

// adminQuizDescriptionUpdate tests
describe('adminQuizDescriptionUpdate - Success Cases', () => {
  let session1: Response, quiz1: Response;
  test('valid authUserId, quizId and name', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizDescriptUpdateRequestV2(session1Data.token, quiz1Data.quizId, newvalidQuizName);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
});

// adminQuizCreate tests
describe('POST /v2/admin/quiz - Success Cases', () => {
  let session1: Response, session2: Response, session3: Response;
  beforeEach(() => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    session2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
  });
  test('valid quiz details', () => {
    const session1Data = JSON.parse(session1.body.toString());
    const response = quizCreateRequestV2(session1Data.token, validQuizName, validQuizDescription);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ quizId: expect.any(Number) });
  });
  test('valid multiple quiz details', () => {
    const session1Data = JSON.parse(session1.body.toString());
    quizCreateRequestV2(session1Data.token + 1, 'Quiz 1', validQuizDescription);
    quizCreateRequestV2(session1Data.token + 1, 'Quiz 2', validQuizDescription);
    quizCreateRequestV2(session1Data.token + 1, 'Quiz 3', validQuizDescription);
    const response = quizCreateRequestV2(session1Data.token, 'Quiz 4', validQuizDescription);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ quizId: expect.any(Number) });
  });
  test('existing name under different user', () => {
    const session1Data = JSON.parse(session1.body.toString());
    quizCreateRequestV2(session1Data.token, validQuizName, validQuizDescription);
    const session2Data = JSON.parse(session2.body.toString());
    const response = quizCreateRequestV2(session2Data.token, validQuizName, validQuizDescription);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ quizId: expect.any(Number) });
  });
})
