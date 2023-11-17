import { clearRequest, authRegisterRequest, quizCreateRequest } from '../../it2/serverTestHelperIt2';
import { person1, person2, validQuizDescription, validQuizName, validpngUrl1, validpngUrl2, validjpgUrl1, validjpgUrl2, invalidimgUrl, unfetchableimgUrl } from '../../../testingData';
import { quizThumbnailUpdateRequest } from '../../serverTestHelperIt3';
import { Response } from 'sync-request';

beforeEach(() => {
  clearRequest();
});

// Update quiz thumbnail tests
describe('quizThumbnailUpdate - Success cases', () => {
  let user1: Response, quiz1: Response;
  test('Update a quiz from no thumbnail to png thumbnail', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(user1Data.token, quiz1Data.quizId, validpngUrl1);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });

  test('Update a quiz from no thumbnail to jpg thumbnail', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(user1Data.token, quiz1Data.quizId, validjpgUrl1);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });

  test('Replace an existing quiz thumbnail with new png thumbnail', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizThumbnailUpdateRequest(user1Data.token, quiz1Data.quizId, validpngUrl1);
    const response = quizThumbnailUpdateRequest(user1Data.token, quiz1Data.quizId, validpngUrl2);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });

  test('Replace an existing quiz thumbnail with new jng thumbnail', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quizThumbnailUpdateRequest(user1Data.token, quiz1Data.quizId, validjpgUrl1);
    const response = quizThumbnailUpdateRequest(user1Data.token, quiz1Data.quizId, validjpgUrl2);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
});

describe('quizThumbnailUpdate - Error cases', () => {
  let user1: Response, user2: Response, quiz1: Response;
  test('invalid token', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(user1Data.token + 1, quiz1Data.quizId, validjpgUrl1);
    expect(response.statusCode).toStrictEqual(401);
  });

  test('QuizId not owned by this user', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    user2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const user2Data = JSON.parse(user2.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(user2Data.token, quiz1Data.quizId, validjpgUrl1);
    expect(response.statusCode).toStrictEqual(403);
  });

  test('thumbnailUrl is an empty string - imgUrl does not return a valid file', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(user1Data.token, quiz1Data.quizId, '');
    expect(response.statusCode).toStrictEqual(400);
  });

  test('thumbnailUrl cannot be fetched - imgUrl does not return a valid file', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(user1Data.token, quiz1Data.quizId, unfetchableimgUrl);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('thumbnailUrl when fetched is not a JPG or PNG image', () => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizThumbnailUpdateRequest(user1Data.token, quiz1Data.quizId, invalidimgUrl);
    expect(response.statusCode).toStrictEqual(400);
  });
});
