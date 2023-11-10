import { person1, person2, person3, validQuizDescription, validQuizName, newvalidQuizName, validQuestionInput1, validQuestionInput2, validQuestionInput1V2, validQuestionInput2V2 } from '../../../testingData';
import { authRegisterRequest, clearRequest, createQuizQuestionRequest, quizCreateRequest, quizInfoRequest } from '../../it2/serverTestHelperIt2';
import { Response } from 'sync-request-curl';
import { quizRemoveRequestV2, quizTransferRequestV2, quizNameUpdateRequestV2, quizDescriptUpdateRequestV2, quizCreateRequestV2, quizListRequestV2, quizInfoRequestV2, createQuizQuestionRequestV2 } from '../../serverTestHelperIt3';
import { getUnixTime } from 'date-fns';
// import { HttpStatusCode } from "../../enums/HttpStatusCode";

beforeEach(() => {
  clearRequest();
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
    const quizInfo1 = quizInfoRequestV2(sess2Data.token, quiz1Data.quizId);
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
  let session1: Response, session2: Response;
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
});

// adminQuizList tests
describe('GET /v2/admin/quiz/list - Success Cases', () => {
  let session1: Response, session2: Response, session3: Response;
  let s1Quiz1: Response, s1Quiz2: Response, s2Quiz1: Response, s2Quiz2: Response, s3Quiz1: Response, s3Quiz2: Response;
  beforeEach(() => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    s1Quiz1 = quizCreateRequestV2(session1Data.token, 'User1 Quiz1', validQuizDescription);
    s1Quiz2 = quizCreateRequestV2(session1Data.token, 'User1 Quiz2', validQuizDescription);

    session2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const session2Data = JSON.parse(session2.body.toString());
    s2Quiz1 = quizCreateRequestV2(session2Data.token, 'User2 Quiz1', validQuizDescription);
    s2Quiz2 = quizCreateRequestV2(session2Data.token, 'User2 Quiz2', validQuizDescription);

    session3 = authRegisterRequest(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const session3Data = JSON.parse(session3.body.toString());
    s3Quiz1 = quizCreateRequestV2(session3Data.token, 'User3 Quiz1', validQuizDescription);
    s3Quiz2 = quizCreateRequestV2(session3Data.token, 'User3 Quiz2', validQuizDescription);
  });
  test('valid user1 list', () => {
    const s1Quiz1Data = JSON.parse(s1Quiz1.body.toString());
    const s1Quiz2Data = JSON.parse(s1Quiz2.body.toString());
    const session1Data = JSON.parse(session1.body.toString());
    const response = quizListRequestV2(session1Data.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizzes: [
          {
            quizId: s1Quiz1Data.quizId,
            name: 'User1 Quiz1',
          },
          {
            quizId: s1Quiz2Data.quizId,
            name: 'User1 Quiz2',
          },
        ]
      }
    );
  });
  test('valid user2 list', () => {
    const s2Quiz1Data = JSON.parse(s2Quiz1.body.toString());
    const s2Quiz2Data = JSON.parse(s2Quiz2.body.toString());
    const session2Data = JSON.parse(session2.body.toString());
    const response = quizListRequestV2(session2Data.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizzes: [
          {
            quizId: s2Quiz1Data.quizId,
            name: 'User2 Quiz1',
          },
          {
            quizId: s2Quiz2Data.quizId,
            name: 'User2 Quiz2',
          },
        ]
      }
    );
  });
  test('valid user3 list', () => {
    const s3Quiz1Data = JSON.parse(s3Quiz1.body.toString());
    const s3Quiz2Data = JSON.parse(s3Quiz2.body.toString());
    const session3Data = JSON.parse(session3.body.toString());
    const response = quizListRequestV2(session3Data.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizzes: [
          {
            quizId: s3Quiz1Data.quizId,
            name: 'User3 Quiz1',
          },
          {
            quizId: s3Quiz2Data.quizId,
            name: 'User3 Quiz2',
          },
        ]
      }
    );
  });
});

// adminQuizInfo tests
describe('GET /v2/admin/quiz/{quizid} - Success Cases', () => {
  let session1: Response, session2: Response, session3: Response;
  let s1Quiz1: Response, s2Quiz1: Response, s3Quiz1: Response;
  beforeEach(() => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const session1Data = JSON.parse(session1.body.toString());
    s1Quiz1 = quizCreateRequestV2(session1Data.token, 'User1 Quiz1', validQuizDescription);

    session2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const session2Data = JSON.parse(session2.body.toString());
    s2Quiz1 = quizCreateRequestV2(session2Data.token, 'User2 Quiz1', validQuizDescription);

    session3 = authRegisterRequest(person3.email, person3.password, person3.nameFirst, person3.nameLast);
    const session3Data = JSON.parse(session3.body.toString());
    s3Quiz1 = quizCreateRequestV2(session3Data.token, 'User3 Quiz1', validQuizDescription);
  });
  test('valid quizId for user1', () => {
    const session1Data = JSON.parse(session1.body.toString());
    const s1QuizData = JSON.parse(s1Quiz1.body.toString());
    const response = quizInfoRequestV2(session1Data.token, s1QuizData.quizId);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizId: s1QuizData.quizId,
        name: 'User1 Quiz1',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: validQuizDescription,
        numQuestions: 0,
        questions: [],
        duration: 0
      }
    );
  });
  test('valid quizId for user2', () => {
    const session2Data = JSON.parse(session2.body.toString());
    const s2QuizData = JSON.parse(s2Quiz1.body.toString());
    const response = quizInfoRequestV2(session2Data.token, s2QuizData.quizId);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizId: s2QuizData.quizId,
        name: 'User2 Quiz1',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: validQuizDescription,
        numQuestions: 0,
        questions: [],
        duration: 0
      }
    );
  });
  test('valid quizId for user3', () => {
    const session3Data = JSON.parse(session3.body.toString());
    const s3QuizData = JSON.parse(s3Quiz1.body.toString());
    const response = quizInfoRequestV2(session3Data.token, s3QuizData.quizId);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        quizId: s3QuizData.quizId,
        name: 'User3 Quiz1',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: validQuizDescription,
        numQuestions: 0,
        questions: [],
        duration: 0
      }
    );
  });
});

describe('Testing V1 vs V2 differences with thumbnailurl for quizInfo', () => {
  test('QuizInfo v1 - no thumbnails', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const quiz = quizCreateRequest(userData.token, validQuizName, validQuizDescription);
    const quizData = JSON.parse(quiz.body.toString());
    const quest1 = createQuizQuestionRequest(quizData.quizId, userData.token, validQuestionInput1);
    const quest2 = createQuizQuestionRequest(quizData.quizId, userData.token, validQuestionInput2);
    const quest1Data = JSON.parse(quest1.body.toString());
    const quest2Data = JSON.parse(quest2.body.toString());
    const response = quizInfoRequest(userData.token, quizData.quizId);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({
      quizId: quizData.quizId,
      name: validQuizName,
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: validQuizDescription,
      numQuestions: expect.any(Number),
      questions: [
        {
          questionId: quest1Data.questionId,
          question: validQuestionInput1.question,
          duration: validQuestionInput1.duration,
          points: validQuestionInput1.points,
          answers: expect.any(Array),
        },
        {
          questionId: quest2Data.questionId,
          question: validQuestionInput2.question,
          duration: validQuestionInput2.duration,
          points: validQuestionInput2.points,
          answers: expect.any(Array),
        }
      ],
      duration: validQuestionInput1.duration + validQuestionInput2.duration,
    });
  });
  test('QuizInfo v2 - no quiz thumbnail, yes question thumbnail', () => {
    const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const userData = JSON.parse(user.body.toString());
    const quiz = quizCreateRequestV2(userData.token, validQuizName, validQuizDescription);
    const quizData = JSON.parse(quiz.body.toString());
    const quest1 = createQuizQuestionRequestV2(quizData.quizId, userData.token, validQuestionInput1V2);
    const quest2 = createQuizQuestionRequestV2(quizData.quizId, userData.token, validQuestionInput2V2);
    const quest1Data = JSON.parse(quest1.body.toString());
    const quest2Data = JSON.parse(quest2.body.toString());
    const response = quizInfoRequestV2(userData.token, quizData.quizId);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({
      quizId: quizData.quizId,
      name: validQuizName,
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: validQuizDescription,
      numQuestions: expect.any(Number),
      questions: [
        {
          questionId: quest1Data.questionId,
          question: validQuestionInput1V2.question,
          duration: validQuestionInput1V2.duration,
          points: validQuestionInput1V2.points,
          answers: expect.any(Array),
          thumbnailUrl: validQuestionInput1V2.thumbnailUrl
        },
        {
          questionId: quest2Data.questionId,
          question: validQuestionInput2V2.question,
          duration: validQuestionInput2V2.duration,
          points: validQuestionInput2V2.points,
          answers: expect.any(Array),
          thumbnailUrl: validQuestionInput2V2.thumbnailUrl
        }
      ],
      duration: validQuestionInput1.duration + validQuestionInput2.duration,
    });
  });
// test('QuizInfo v2 - yes quiz thumbnail, yes question thumbnail', () => {
//   const user = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
//   const userData = JSON.parse(user.body.toString());
//   const quiz = quizCreateRequestV2(userData.token, validQuizName, validQuizDescription);
//   const quizData = JSON.parse(quiz.body.toString());
//   const quest1 = createQuizQuestionRequestV2(quizData.quizId, userData.token, validQuestionInput1V2);
//   const quest2 = createQuizQuestionRequestV2(quizData.quizId, userData.token, validQuestionInput2V2);
//   const quest1Data = JSON.parse(quest1.body.toString());
//   const quest2Data = JSON.parse(quest2.body.toString());
//   // INCLUDE CODE TO ADD A QUIZ THUMBNAIL
//   const response = quizInfoRequestV2(userData.token, quizData.quizId);
//   expect(response.statusCode).toStrictEqual(200);
//   console.log('v2', JSON.parse(response.body.toString()));
//   expect(JSON.parse(response.body.toString())).toStrictEqual({
//       quizId: quizData.quizId,
//       name: validQuizName,
//       timeCreated: expect.any(Number),
//       timeLastEdited: expect.any(Number),
//       description: validQuizDescription,
//       numQuestions: expect.any(Number),
//       questions: [
//         {
//           questionId: quest1Data.questionId,
//           question: validQuestionInput1V2.question,
//           duration: validQuestionInput1V2.duration,
//           points: validQuestionInput1V2.points,
//           answers: expect.any(Array),
//           thumbnailUrl: validQuestionInput1V2.thumbnailUrl
//         },
//         {
//           questionId: quest2Data.questionId,
//           question: validQuestionInput2V2.question,
//           duration: validQuestionInput2V2.duration,
//           points: validQuestionInput2V2.points,
//           answers: expect.any(Array),
//           thumbnailUrl: validQuestionInput2V2.thumbnailUrl
//         }
//       ],
//       duration: validQuestionInput1.duration + validQuestionInput2.duration,
//       thumbnail: // INCLUDE SOME STRING HERE
//   });
//   });
});
