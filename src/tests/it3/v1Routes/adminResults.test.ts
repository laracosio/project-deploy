import { Response } from 'sync-request-curl';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';
import {
  createQuizQuestionRequestV2,
  quizFinalResultsRequest,
  quizFinalResultsCSVRequest
} from '../../serverTestHelperIt3';
import { person1, person2 } from '../../../testingData';
import { authRegisterRequest, clearRequest, quizCreateRequest } from '../../it2/serverTestHelperIt2';
import { Datastore, Player, QuestionCreate, Quiz, Session, getData } from '../../../dataStore';
import fs from 'fs';
import { setAndSave } from '../../../services/otherService';
import { SessionStates } from '../../../enums/SessionStates';

beforeEach(() => {
  // const datastr: Buffer = fs.readFileSync('./datastore.json');
  // const dataStore: Datastore = JSON.parse(String(datastr));
  // dataStore.users = [];
  // dataStore.quizzes = [];
  // dataStore.tokens = [];
  // dataStore.trash = [];
  // setAndSave(dataStore);
  clearRequest();
});

// quizFinalResults tests
describe('GET /v1/admin/quiz/{quizid}/session/{sessionid}/x - Success Cases', () => {
  let admin: Response, quiz: Response, q1: Response, q2: Response, q3: Response;
  let quizSession: Session;
  beforeEach(() => {
    admin = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const adminData = JSON.parse(admin.body.toString());

    quiz = quizCreateRequest(adminData.token, 'Name That Professor', 'Hogwarts Professors');
    const quizData = JSON.parse(quiz.body.toString());

    const question1: QuestionCreate = {
      question: 'Who Cat?',
      duration: 10,
      points: 1,
      answers: [
        { answer: 'Bob', correct: false },
        { answer: 'Steve', correct: false },
        { answer: 'Minerva', correct: true }
      ]
    };
    const question2: QuestionCreate = {
      question: 'Last year potions?',
      duration: 10,
      points: 5,
      answers: [
        { answer: 'Jack', correct: false },
        { answer: 'Jill', correct: false },
        { answer: 'Horace', correct: true }
      ]
    };
    const question3: QuestionCreate = {
      question: 'Herbology?',
      duration: 10,
      points: 10,
      answers: [
        { answer: 'Pomona', correct: true },
        { answer: 'Mindy', correct: false },
        { answer: 'Peter', correct: false }
      ]
    };

    q1 = createQuizQuestionRequestV2(quizData.quizId, adminData.token, question1);
    // console.log(q1);
    q2 = createQuizQuestionRequestV2(quizData.quizId, adminData.token, question2);
    q3 = createQuizQuestionRequestV2(quizData.quizId, adminData.token, question3);

    const datastr: Buffer = fs.readFileSync('./datastore.json');
    const data: Datastore = JSON.parse(String(datastr));
    const quizProf: Quiz = data.quizzes.find(quiz => quiz.quizId === quizData.quizId);
    quizProf.questions[0].playersCorrectList = ['Hermione', 'Ron'];
    quizProf.questions[1].playersCorrectList = ['Hermione', 'Harry', 'Ron'];
    quizProf.questions[2].playersCorrectList = ['Hermione', 'Harry'];
    console.log(quizProf.questions[0]);
    console.log(quizProf.questions[1]);
    console.log(quizProf.questions[2]);
    // setAndSave(data);

    // console.log('From beforeEach:');
    // console.log('line 72');
    // console.log(quizProf.questions);
    // console.log(quizProf.questions[0].playersCorrectList);
    // console.log(quizProf.questions[1].playersCorrectList);
    // console.log(quizProf.questions[2].playersCorrectList);

    // replace with guestPlayerJoin
    const player1: Player = {
      playerId: 1,
      playerName: 'Harry',
      playerAnswers: [
        { questionId: 1, score: 0 },
        { questionId: 2, score: 2.5 },
        { questionId: 3, score: 5 }
      ]
    };
    const player2: Player = {
      playerId: 2,
      playerName: 'Hermione',
      playerAnswers: [
        { questionId: 1, score: 1 },
        { questionId: 2, score: 5 },
        { questionId: 3, score: 10 }
      ]
    };
    const player3: Player = {
      playerId: 3,
      playerName: 'Ron',
      playerAnswers: [
        { questionId: 1, score: 0.5 },
        { questionId: 2, score: 1.7 },
        { questionId: 3, score: 0 }
      ]
    };

    // replace with startSession
    quizSession = {
      sessionId: 1234,
      sessionQuiz: quizProf,
      sessionState: SessionStates.FINAL_RESULTS,
      autoStartNum: 1,
      atQuestion: 1,
      sessionPlayers: [player1, player2, player3],
      messages: []
    };
    data.sessions.push(quizSession);
    setAndSave(data);
    console.log(data.sessions);
    // console.log(data.sessions);
    // console.log(data.sessions[0].sessionPlayers);
  });
  test.only('/results - Success: all players have different results', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const q1Data = JSON.parse(q1.body.toString());
    const q2Data = JSON.parse(q2.body.toString());
    const q3Data = JSON.parse(q3.body.toString());

    console.log('from test');
    console.log(quizSession);

    const response: Response = quizFinalResultsRequest(quizData.quizId, 1234, adminData.token);

    expect(response.statusCode).toStrictEqual(HttpStatusCode.OK);
    expect(JSON.parse(response.body.toString())).toStrictEqual({
      usersRankedByScore: [
        {
          name: 'Hermione',
          score: 16
        },
        {
          name: 'Harry',
          score: 7.5
        },
        {
          name: 'Ron',
          score: 2.2
        }
      ],
      questionResults: [
        {
          questionId: q1Data.questionId,
          playersCorrectList: ['Hermione', 'Ron'],
          averageAnswerTime: expect.any(Number),
          percentCorrect: expect.any(Number)
        },
        {
          questionId: q2Data.questionId,
          playersCorrectList: ['Hermione', 'Harry', 'Ron'],
          averageAnswerTime: expect.any(Number),
          percentCorrect: expect.any(Number)
        },
        {
          questionId: q3Data.questionId,
          playersCorrectList: ['Hermione', 'Harry'],
          averageAnswerTime: expect.any(Number),
          percentCorrect: expect.any(Number)
        }
      ]
    });
  });
  // test('/results/csv - Success: all players have different results', () => {
  //   const adminData = JSON.parse(admin.body.toString());
  //   const quizData = JSON.parse(quiz.body.toString());

  //   const response: Response = quizFinalResultsCSVRequest(quizData.quizid, 1234, adminData.token);

  //   expect(response.statusCode).toStrictEqual(HttpStatusCode.OK);
  //   expect(JSON.parse(response.body.toString())).toStrictEqual({ url: 'http://google.com/some/image/path.csv' });
  // });
  test.only('/results - Success: two players in 1st', () => {
    // console.log(quizSession);
    const datastr: Buffer = fs.readFileSync('./datastore.json');
    const data: Datastore = JSON.parse(String(datastr));
    const quizProfSession: Session = data.sessions.find(s => s.sessionId === 1234);

    // console.log(quizProfSession);
    // console.log(quizProfSession.sessionPlayers);

    // Harry's score changes to 16 -> equal 1st with Hermione
    quizProfSession.sessionPlayers[0].playerAnswers[0].score = 1;
    quizProfSession.sessionPlayers[0].playerAnswers[1].score = 5;
    quizProfSession.sessionPlayers[0].playerAnswers[2].score = 10;

    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    console.log(quizData);
    const q1Data = JSON.parse(q1.body.toString());
    const q2Data = JSON.parse(q1.body.toString());
    const q3Data = JSON.parse(q1.body.toString());

    const response: Response = quizFinalResultsRequest(quizData.quizId, 1234, adminData.token);

    expect(response.statusCode).toStrictEqual(HttpStatusCode.OK);
    expect(JSON.parse(response.body.toString())).toStrictEqual({
      usersRankedByScore: [
        {
          name: 'Hermione',
          score: 16
        },
        {
          name: 'Harry',
          score: 7.5
        },
        {
          name: 'Ron',
          score: 2.2
        }
      ],
      questionResults: [
        {
          questionId: q1Data.questionId,
          playersCorrectList: ['Hermione', 'Ron', 'Harry'],
          averageAnswerTime: expect.any(Number),
          percentCorrect: expect.any(Number)
        },
        {
          questionId: q2Data.questionId,
          playersCorrectList: ['Hermione', 'Harry', 'Ron'],
          averageAnswerTime: expect.any(Number),
          percentCorrect: expect.any(Number)
        },
        {
          questionId: q3Data.questionId,
          playersCorrectList: ['Hermione', 'Harry'],
          averageAnswerTime: expect.any(Number),
          percentCorrect: expect.any(Number)
        }
      ]
    });
  });
  // test('/results/csv - Success: two players in 1st', () => {
  //   const datastr: Buffer = fs.readFileSync('./datastore.json');
  //   const data: Datastore = JSON.parse(String(datastr));
  //   const quizProfSession: Session = data.sessions.find(s => s.sessionId === 1234);

  //   // Harry's score changes to 16 -> equal 1st with Hermione
  //   quizProfSession.sessionPlayers[0].playerAnswers[0].score = 1;
  //   quizProfSession.sessionPlayers[0].playerAnswers[1].score = 5;
  //   quizProfSession.sessionPlayers[0].playerAnswers[2].score = 10;

  //   const adminData = JSON.parse(admin.body.toString());
  //   const quizData = JSON.parse(quiz.body.toString());

  //   const response: Response = quizFinalResultsCSVRequest(quizData.quizid, 1234, adminData.token);

  //   expect(response.statusCode).toStrictEqual(HttpStatusCode.OK);
  //   expect(JSON.parse(response.body.toString())).toStrictEqual({ url: 'http://google.com/some/image/path.csv' });
  // });
});

describe('GET /v1/admin/quiz/{quizid}/session/{sessionid}/x - Error Cases', () => {
  let admin: Response, admin2: Response, quiz: Response, quiz2: Response, quizSession: Session, quiz2Session: Session;
  beforeEach(() => {
    const { email, password, nameFirst, nameLast } = person1;
    admin = authRegisterRequest(email, password, nameFirst, nameLast);
    const adminData = JSON.parse(admin.body.toString());

    quiz = quizCreateRequest(adminData.token, 'Name That Professor', 'Hogwarts Professors');
    const quizData = JSON.parse(quiz.body.toString());

    admin2 = authRegisterRequest(person2.email, person2.password, person2.nameFirst, person2.nameLast);
    const admin2Data = JSON.parse(admin2.body.toString());
    quiz2 = quizCreateRequest(admin2Data.token, 'Name That Potato', 'Types of Potatoes');
    const quiz2Data = JSON.parse(quiz2.body.toString());

    const datastr: Buffer = fs.readFileSync('./datastore.json');
    const data: Datastore = JSON.parse(String(datastr));
    const quizProf: Quiz = data.quizzes.find(quiz => quiz.quizId === quizData.quizId);
    const quizPotato: Quiz = data.quizzes.find(quiz => quiz.quizId === quiz2Data.quizId);

    // replace with guestPlayerJoin
    const player1: Player = {
      playerId: 1,
      playerName: 'Harry',
      playerAnswers: [
        { questionId: 1, score: 1 },
        { questionId: 2, score: 5 },
        { questionId: 3, score: 10 }
      ]
    };

    // replace with startSession
    quizSession = {
      sessionId: 1234,
      sessionQuiz: quizProf,
      sessionState: SessionStates.FINAL_RESULTS,
      autoStartNum: 1,
      atQuestion: 1,
      sessionPlayers: [player1],
      messages: []
    };

    quiz2Session = {
      sessionId: 5678,
      sessionQuiz: quizPotato,
      sessionState: SessionStates.FINAL_RESULTS,
      autoStartNum: 1,
      atQuestion: 1,
      sessionPlayers: [player1],
      messages: []
    };
  });
  test('/results - Error: Session Id does not refer to a valid session within this quiz', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsRequest(quizData.quizId, 12345, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('/results - Error: Session is not in FINAL_RESULTS state', () => {
    const datastr: Buffer = fs.readFileSync('./datastore.json');
    const data: Datastore = JSON.parse(String(datastr));
    const quizProfSession: Session = data.sessions.find(s => s.sessionId === 1234);
    // change state to be !FINAL_RESULTS
    quizProfSession.sessionState = SessionStates.ANSWER_SHOW;

    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsRequest(quizData.quizId, 1234, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('/results - Error: Token is empty or invalid (does not refer to valid logged in user session)', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsRequest(quizData.quizId, 1234, adminData.token + 1);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  });
  test('/results - Error: Valid token is provided, but user is not authorised to view this session', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsRequest(quizData.quizId, 1234, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  });
  // test('/results/csv - Error: Session Id does not refer to a valid session within this quiz', () => {
  //   const adminData = JSON.parse(admin.body.toString());
  //   const quizData = JSON.parse(quiz.body.toString());
  //   const response: Response = quizFinalResultsCSVRequest(quizData.quizid, 12345, adminData.token);
  //   expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  // });
  // test('/results/csv - Error: Session is not in FINAL_RESULTS state', () => {
  //   const datastr: Buffer = fs.readFileSync('./datastore.json');
  //   const data: Datastore = JSON.parse(String(datastr));
  //   const quizProfSession: Session = data.sessions.find(s => s.sessionId === 1234);
  //   // change state to be !FINAL_RESULTS
  //   quizProfSession.sessionState = SessionStates.ANSWER_SHOW;

  //   const adminData = JSON.parse(admin.body.toString());
  //   const quizData = JSON.parse(quiz.body.toString());
  //   const response: Response = quizFinalResultsCSVRequest(quizData.quizid, 1234, adminData.token);
  //   expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  // });
  // test('/results/csv - Error: Token is empty or invalid (does not refer to valid logged in user session)', () => {
  //   const adminData = JSON.parse(admin.body.toString());
  //   const quizData = JSON.parse(quiz.body.toString());
  //   const response: Response = quizFinalResultsCSVRequest(quizData.quizid, 1234, adminData.token + 1);
  //   expect(response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  // });
  // test('/results/csv - Error: Valid token is provided, but user is not authorised to view this session', () => {
  //   const adminData = JSON.parse(admin.body.toString());
  //   const quizData = JSON.parse(quiz.body.toString());
  //   const response: Response = quizFinalResultsCSVRequest(quizData.quizid, 5678, adminData.token);
  //   expect(response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  // });
});
