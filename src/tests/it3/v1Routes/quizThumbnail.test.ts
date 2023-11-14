import { clearRequest, authRegisterRequest, quizCreateRequest } from '../../it2/serverTestHelperIt2';
import {person1, person2, validQuizDescription, validQuizName,  validpngUrl1, validpngUrl2, validjpgUrl1, validjpgUrl2, invalidimgUrl, unfetchableimgUrl } from '../../../testingData';
import { quizThumbnailUpdateRequest } from '../../serverTestHelperIt3';
import { Response } from 'sync-request-curl';
import { token } from 'morgan';


beforeEach(() => {
  clearRequest();
});

// Update quiz thumbnail tests
describe('quizThumbnailUpdate - Success cases', () => {
  let session1: Response, quiz1: Response, thumbnailUpdate1: Response;
  test('Update a quiz from no thumbnail to png thumbnail', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(session1Data.token, quiz1Data.quizId, validpngUrl1);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
  
  test('Update a quiz from no thumbnail to jpg thumbnail', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(session1Data.token, quiz1Data.quizId, validjpgUrl1);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });

  test('Replace an existing quiz thumbnail with new png thumbnail', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    thumbnailUpdate1 = quizThumbnailUpdateRequest(session1Data.token, quiz1Data.quizId, validpngUrl1);
    const response = quizThumbnailUpdateRequest(session1Data.token, quiz1Data.quizId, validpngUrl2);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });

  test('Replace an existing quiz thumbnail with new png thumbnail', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    thumbnailUpdate1 = quizThumbnailUpdateRequest(session1Data.token, quiz1Data.quizId, validjpgUrl1);
    const response = quizThumbnailUpdateRequest(session1Data.token, quiz1Data.quizId, validjpgUrl2);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
});

describe('quizThumbnailUpdate - Error cases', () => {
  let session1: Response, session2: Response, quiz1: Response;
  test('invalid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(session1Data.token + 1, quiz1Data.quizId, validjpgUrl1);
    expect(response.statusCode).toStrictEqual(401);
  });

  test('QuizId not owned by this user', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    session2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const session2Data = JSON.parse(session2.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(session2Data.token, quiz1Data.quizId, validjpgUrl1);
    expect(response.statusCode).toStrictEqual(403);
  });
  
  test('thumbnailUrl is an empty string - imgUrl does not return a valid file', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(session1Data.token, quiz1Data.quizId, validjpgUrl1);
    expect(response.statusCode).toStrictEqual(400);
  });
  
  test('thumbnailUrl cannot be fetched - imgUrl does not return a valid file', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(session1Data.token, quiz1Data.quizId, unfetchableimgUrl);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('thumbnailUrl when fetched is not a JPG or PNG image', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(session1Data.token, quiz1Data.quizId, invalidimgUrl);
    expect(response.statusCode).toStrictEqual(400);
  });
});
