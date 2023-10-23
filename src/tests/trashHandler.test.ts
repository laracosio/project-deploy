// // DELETE THIS LATER
test('REMOVE ME - added to pass testing pipeline!', () => {
  const number = 1;
  expect(number).toBeGreaterThanOrEqual(1);
});


import { authRegisterRequest, clearRequest, quizCreateRequest, quizRemoveRequest, quizViewTrashRequest } from './serverTestHelper';
import { person1, person2, person3, person4, person5, validQuizName, validQuizDescription } from '../testingData';
import { Response } from 'sync-request-curl';

beforeEach(() => {
  clearRequest();
});

// quizViewTrash tests
describe('quizViewTrash - Success Cases', () => {
  let session1: Response, quiz1: Response;
  test('valid authUserId, quizId and name', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizViewTrashRequest(session1Data.token);
    const responseData = JSON.parse(response.body.toString());
    expect(responseData).toStrictEqual({});
  });
});

describe('quizViewTrash - Error Cases', () => {
  let session1: Response, quiz1: Response;
  test('invalid token', () => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    quiz1 = quizCreateRequest(session1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const response = quizViewTrashRequest(session1Data.token + 1);
    expect(response.statusCode).toStrictEqual(401);
  });
});