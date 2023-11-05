import { authLoginRequest, clearRequest, authRegisterRequest, quizCreateRequest, createQuizQuestionRequest } from '../it2-testing/serverTestHelperIt2';
import {
  person1, validQuizDescription, validQuizName, validCreateQuestionV2PNG, validCreateQuestionV2JPG, invalidCreateQuestionV2URLNotPNGJPG, invalidCreateQuestionV2URLEmpty, invalidCreateQuestionV2URLInvalid, validUpdateQuestionV2PNG,
  invalidCreateQuestionV2InvalidURL, invalidCreateQuestionV2EmptyURL, invalidCreateQuestionV2NotJPGPNG
} from '../../testingData';
import { createQuizQuestionRequestV2, updateQuizQuestionRequestV2 } from '../serverTestHelperIt3';
beforeEach(() => {
  clearRequest();
});

// question create
describe('Successful tests: Create a quiz question V2', () => {
  test('Create a Quiz Question test - png', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const res = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ questionId: expect.any(Number) });
  });
  test('Create a Quiz Question test - png', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const res = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2JPG);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ questionId: expect.any(Number) });
  });
});

describe('Unsuccessful tests (400): Create a quiz question V2', () => {
  test('Unsuccessful (400): The thumbnailUrl is an empty string', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const res = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, invalidCreateQuestionV2URLEmpty);

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The thumbnailUrl is an JPG/PNG', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const res = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, invalidCreateQuestionV2URLNotPNGJPG);

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The thumbnailUrl is invalid', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());

    const res = createQuizQuestionRequestV2(quizIdParsed.quizId, personLoginParsed.token, invalidCreateQuestionV2URLInvalid);

    const data = JSON.parse(res.body.toString());

    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

// update question
describe('Successful tests: Update a quiz question V2', () => {
  test('Update a quiz question test', () => {
    authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const res = updateQuizQuestionRequestV2(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, validUpdateQuestionV2PNG);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
  });
});

// update
describe('Unsuccessful tests (400): Update a quiz question V2', () => {
  test('Unsuccessful (400): The thumbnailUrl is an empty string', () => {
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const res = updateQuizQuestionRequestV2(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidCreateQuestionV2EmptyURL);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The thumbnailUrl is an JPG/PNG', () => {
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const res = updateQuizQuestionRequestV2(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidCreateQuestionV2NotJPGPNG);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('Unsuccessful (400): The thumbnailUrl is invalid', () => {
    const personLogin = authLoginRequest(person1.email, person1.password);
    const personLoginParsed = JSON.parse(personLogin.body.toString());
    const quizId = quizCreateRequest(personLoginParsed.token, validQuizName, validQuizDescription);
    const quizIdParsed = JSON.parse(quizId.body.toString());
    const createQuestion = createQuizQuestionRequest(quizIdParsed.quizId, personLoginParsed.token, validCreateQuestionV2PNG);
    const createQuestionParsed = JSON.parse(createQuestion.body.toString());

    const res = updateQuizQuestionRequestV2(quizIdParsed.quizId, createQuestionParsed.questionId, personLoginParsed.token, invalidCreateQuestionV2InvalidURL);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});
