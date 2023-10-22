import { authRegisterRequest, clearRequest, quizCreateRequest, quizInfoRequest, duplicateQuestionRequest } from './serverTestHelper';
import { person1, person2, validQuizName, validQuizDescription, validQuestionInput1, validQuestionInput2 } from '../testingData';
import { Response } from 'sync-request-curl';

beforeEach(() => {
  clearRequest();
});


// duplicate Question - needs createQuestion
describe('POST /v1/admin/quiz/{quizid}/question/{questionid}/duplicate - Error', () => {
  let sess1: Response, quiz1: Response, quest1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    quest1 = createQuestionRequest(sess1Data.token, validQuestionInput1, quiz1Data.quizId);
  });
  test('Duplicate question successfully', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ newQuestionId: expect.any(Number) });

    const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    expect(JSON.parse(quizInfo.body.toString())).toStrictEqual(
      {
        quizId: quiz1Data.quizId,
        name: validQuizName,
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: validQuizDescription,
        numQuestions: 2,
        questions: [
          {
            questionId: quest1Data.quizId,
            question: validQuestionInput1.question,
            duration: validQuestionInput1.duration,
            points: validQuestionInput1.points,
            answers: validQuestionInput1.answers
          }, 
          {
            questionId: data.quizId,
            question: validQuestionInput1.question,
            duration: validQuestionInput1.duration,
            points: validQuestionInput1.points,
            answers: validQuestionInput1.answers
          }
        ],
        duration: (validQuestionInput1.duration * 2)
      }
    );
  });
  test('Remove twice duplicated question', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const firstDupQ = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
    const firstDupQData = JSON.parse(firstDupQ.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ newQuestionId: expect.any(Number) });
    // remove first duplicated question. second duplicate to remain
    questionRemoveRequest(sess1Data.token, quiz1Data.quizId, firstDupQData.questionId);

    const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    expect(JSON.parse(quizInfo.body.toString())).toStrictEqual(
      {
        quizId: quiz1Data.quizId,
        name: validQuizName,
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: validQuizDescription,
        numQuestions: 2,
        questions: [
          {
            questionId: quest1Data.quizId,
            question: validQuestionInput1.question,
            duration: validQuestionInput1.duration,
            points: validQuestionInput1.points,
            answers: validQuestionInput1.answers
          }, 
          {
            questionId: data.quizId,
            question: validQuestionInput1.question,
            duration: validQuestionInput1.duration,
            points: validQuestionInput1.points,
            answers: validQuestionInput1.answers
          }
        ],
        duration: (validQuestionInput1.duration * 2)
      }
    );
  });
  test('duplicateQuestion appears immediately after', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const newQuestion = createQuestionRequest(sess1Data.token, validQuestionInput2, quiz1Data.quizId);
    const newQuestData = JSON.parse(newQuestion.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ newQuestionId: expect.any(Number) });

    const quizInfo = quizInfoRequest(sess1Data.token, quiz1Data.quizId);
    expect(JSON.parse(quizInfo.body.toString())).toStrictEqual(
      {
        quizId: quiz1Data.quizId,
        name: validQuizName,
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: validQuizDescription,
        numQuestions: 3,
        questions: [
          {
            questionId: quest1Data.quizId,
            question: validQuestionInput1.question,
            duration: validQuestionInput1.duration,
            points: validQuestionInput1.points,
            answers: validQuestionInput1.answers
          }, 
          {
            questionId: data.quizId,
            question: validQuestionInput1.question,
            duration: validQuestionInput1.duration,
            points: validQuestionInput1.points,
            answers: validQuestionInput1.answers
          }, 
          {
            questionId: newQuestData.quizId,
            question: validQuestionInput2.question,
            duration: validQuestionInput2.duration,
            points: validQuestionInput2.points,
            answers: validQuestionInput2.answers
          }
        ],
        duration: ((validQuestionInput1.duration * 2) + (validQuestionInput2. duration))
      }
    );
  });
});

describe('POST /v1/admin/quiz/{quizid}/question/{questionid}/duplicate - Error', () => {
  let sess1: Response, sess2: Response, quiz1: Response, quest1: Response;
  beforeEach(() => {
    sess1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const sess1Data = JSON.parse(sess1.body.toString());
    quiz1 = quizCreateRequest(sess1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    sess2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    quest1 = createQuestionRequest(sess1Data.token, validQuestionInput1, quiz1Data.quizId);
  });
  test('invalid quizId', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId + 1, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('questionId is invalid for question', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId + 1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('token is empty', () => {
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest('', quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });
  test('token belongs to a logged out session', () => {
    const sess1Data = JSON.parse(sess1.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    quizLogoutRequest(sess1Data.token);
    const res = duplicateQuestionRequest(sess1Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(401);
  });
  test('Valid token is provided but user is not an owner', () => {
    const sess2Data = JSON.parse(sess2.body.toString());
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const quest1Data = JSON.parse(quest1.body.toString());
    const res = duplicateQuestionRequest(sess2Data.token, quiz1Data.quizId, quest1Data.questionId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String) });
    expect(res.statusCode).toStrictEqual(403);
  });
});