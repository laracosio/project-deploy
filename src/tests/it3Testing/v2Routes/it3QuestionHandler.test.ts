import { getUnixTime } from 'date-fns';
import { invalidCreateQuestionV2EmptyURL, invalidCreateQuestionV2InvalidURL, invalidCreateQuestionV2NotJPGPNG, invalidCreateQuestionV2URLEmpty, invalidCreateQuestionV2URLInvalid, invalidCreateQuestionV2URLNotPNGJPG, person1, validCreateQuestionV2JPG, validCreateQuestionV2PNG, validQuestionInput1, validQuestionInput2, validQuizDescription, validQuizName, validUpdateQuestionV2PNG } from '../../../testingData';
import { authLoginRequest, authRegisterRequest, clearRequest, createQuizQuestionRequest, quizCreateRequest, quizInfoRequest } from '../../it2Testing/serverTestHelperIt2';
import { Response } from 'sync-request-curl';
import { createQuizQuestionRequestV2, duplicateQuestionRequestV2, moveQuestionRequestV2, updateQuizQuestionRequestV2 } from '../../serverTestHelperIt3';

beforeEach(() => {
  clearRequest();
});

// move question
describe('PUT /v2/admin/quiz/{quizid}/question/{questionid}/move', () => {
  let sess1: Response, quiz1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    // to be updated to quizCreateRequest V2 route once made
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
  });
  test('Success - Move Question 2 to new Position and check lastEdited', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    // update this to V2 route
    // const quest1 = createQuizQuestionRequestV2(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    // delete below once quizInfo updated replaced by ^
    createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
    // below needed for quizInfo
    // const quest1Data = JSON.parse(quest1.body.toString());
    const quest2 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput2);
    const quest2Data = JSON.parse(quest2.body.toString());
    const res = moveQuestionRequestV2(sess1Data.token, quiz1Data.quizId, quest2Data.questionId, 0);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    // update this to V2 route
    const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    const quizInfoData = JSON.parse(quizInfo.body.toString());
    expect(quizInfoData.timeLastEdited).toBeGreaterThanOrEqual(getUnixTime(new Date()));
    // expect(quizInfoData.questions).toStrictEqual(
    //   [
    //     {
    //       questionId: quest2Data.questionId,
    //       question: validQuestionInput2.question,
    //       duration: validQuestionInput2.duration,
    //       points: validQuestionInput2.points,
    //       answers: expect.any(Array)
    //     },
    //     {
    //       questionId: quest1Data.questionId,
    //       question: validQuestionInput1.question,
    //       duration: validQuestionInput1.duration,
    //       points: validQuestionInput1.points,
    //       answers: expect.any(Array)
    //     }
    //   ]
    // );
  });
});

describe('POST /v2/admin/quiz/{quizid}/question/{questionid}/duplicate', () => {
  let sess1: Response, quiz1: Response, quest1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    // update to v2 route once made
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    // update to v2 route once made
    quest1 = createQuizQuestionRequest(quiz1Data.quizId, sess1Data.token, validQuestionInput1);
  });
  test('Duplicate question successfully', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequestV2(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ newQuestionId: expect.any(Number) });
    // const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    // const infoData = JSON.parse(quizInfo.body.toString());
    // expect(infoData.questions[1]).toStrictEqual(
    //   {
    //     questionId: data.newQuestionId,
    //     question: validQuestionInput1.question,
    //     duration: validQuestionInput1.duration,
    //     points: validQuestionInput1.points,
    //     answers: [
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput1.answers[0].answer,
    //         correct: validQuestionInput1.answers[0].correct,
    //         colour: expect.any(String)
    //       },
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput1.answers[1].answer,
    //         correct: validQuestionInput1.answers[1].correct,
    //         colour: expect.any(String)
    //       },
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput1.answers[2].answer,
    //         correct: validQuestionInput1.answers[2].correct,
    //         colour: expect.any(String)
    //       },
    //       {
    //         answerId: expect.any(Number),
    //         answer: validQuestionInput1.answers[3].answer,
    //         correct: validQuestionInput1.answers[3].correct,
    //         colour: expect.any(String)
    //       }
    //     ]
    //   }
    // );
  });
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