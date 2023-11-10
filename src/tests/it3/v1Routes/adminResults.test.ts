import { Response } from 'sync-request-curl';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';
import { createQuizQuestionRequestV2, quizFinalResultsRequest, quizFinalResultsCSVRequest } from '../../serverTestHelperIt3';
import { person1, person2 } from '../../../testingData';
import { authRegisterRequest, quizCreateRequest } from '../../it2/serverTestHelperIt2';
import { Datastore, Player, QuestionCreate, Quiz, Session } from '../../../dataStore';
import fs from 'fs';
import { setAndSave } from '../../../services/otherService';

// quizFinalResults tests
describe('GET /v1/admin/quiz/{quizid}/session/{sessionid}/x - Success Cases', () => {
  let admin: Response, quiz: Response, q1: Response, q2: Response, q3: Response;
  let quizSession: Session;
  beforeEach(() => {
    const { email, password, nameFirst, nameLast } = person1;
    admin = authRegisterRequest(email, password, nameFirst, nameLast);
    const adminData = JSON.parse(admin.body.toString());
  
    quiz = quizCreateRequest(adminData.token, 'Name That Professor', 'Hogwarts Professors');
    const quizData = JSON.parse(quiz.body.toString());
    const question1: QuestionCreate = {
      question: 'Cat?',
      duration: 10,
      points: 10,
      answers: [{ answer: 'Bob', correct: false }, { answer: 'Steve', correct: false }, { answer: 'Minerva', correct: true }],
    }
    const question2: QuestionCreate = {
      question: 'Last year potions?',
      duration: 10,
      points: 20,
      answers: [{ answer: 'Jack', correct: false }, { answer: 'Jill', correct: false }, { answer: 'Horace', correct: true }],
    }
    const question3: QuestionCreate = {
      question: 'Herbology?',
      duration: 10,
      points: 30,
      answers: [{ answer: 'Pomona', correct: true }, { answer: 'Mindy', correct: false }, { answer: 'Peter', correct: false }],
    }
    q1 = createQuizQuestionRequestV2(quizData.quizid, adminData.token, question1);
    q2 = createQuizQuestionRequestV2(quizData.quizid, adminData.token, question2);
    q3 = createQuizQuestionRequestV2(quizData.quizid, adminData.token, question3);
    
    const datastr: Buffer = fs.readFileSync('./datastore.json');
    const data: Datastore = JSON.parse(String(datastr));
    const quizProf: Quiz = data.quizzes.find(quiz => quiz.quizId === quizData.quizId);
    quizProf.questions[0].playersCorrectList = ['Hermione', 'Ron'];
    quizProf.questions[1].playersCorrectList = ['Hermione', 'Harry', 'Ron'];
    quizProf.questions[2].playersCorrectList = ['Hermione', 'Harry'];
    setAndSave(data);
    
    // replace with guestPlayerJoin
    const player1: Player = { playerId: 1, playerName: 'Harry', playerScore: 50 };
    const player2: Player = { playerId: 2, playerName: 'Hermione', playerScore: 60 };
    const player3: Player = { playerId: 3, playerName: 'Ron', playerScore: 30 };

    // replace with startSession
    quizSession = {
      sessionId: 1234,
      sessionQuiz: quizProf,
      sessionState: 1,
      autoStartNum: 1,
      atQuestion: 1,
      sessionPlayers: [player1, player2, player3],
      messages: []
    }
  });
  test('/results - Success: all players have different results', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const q1Data = JSON.parse(q1.body.toString());
    const q2Data = JSON.parse(q2.body.toString());
    const q3Data = JSON.parse(q3.body.toString());

    const response: Response = quizFinalResultsRequest(quizData.quizid, quizSession.sessionId, adminData.token);

    expect(response.statusCode).toStrictEqual(HttpStatusCode.OK);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        'usersRankedByScore': [
          {
            'name': 'Hermione',
            'score': 60,
          },
          {
            'name': 'Harry',
            'score': 50,
          },
          {
            'name': 'Ron',
            'score': 30,
          }
        ],
        'questionResults': [
          {
            'questionId': q1Data.questionId,
            'playersCorrectList': [
              'Hermione',
              'Ron'
            ],
            'averageAnswerTime': expect.any(Number),
            'percentCorrect': expect.any(Number)
          },
          {
            'questionId': q2Data.questionId,
            'playersCorrectList': [
              'Hermione',
              'Harry',
              'Ron'
            ],
            'averageAnswerTime': expect.any(Number),
            'percentCorrect': expect.any(Number)
          },
          {
            'questionId': q3Data.questionId,
            'playersCorrectList': [
              'Hermione',
              'Harry'
            ],
            'averageAnswerTime': expect.any(Number),
            'percentCorrect': expect.any(Number)
          }
        ]
      }
    );
  });
  test('/results/csv - Success: all players have different results', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());

    const response: Response = quizFinalResultsCSVRequest(quizData.quizid, quizSession.sessionId, adminData.token);

    expect(response.statusCode).toStrictEqual(HttpStatusCode.OK);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ "url": "http://google.com/some/image/path.csv" });
  });
  test('/results - Success: two players in 1st', () => {
    const datastr: Buffer = fs.readFileSync('./datastore.json');
    const data: Datastore = JSON.parse(String(datastr));
    const quizProfSession: Session = data.sessions.find(s => s.sessionId === quizSession.sessionId);

    // Harry's score changes to 60 -> equal 1st with Hermione
    quizProfSession.sessionPlayers[0].playerScore = 60;

    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const q1Data = JSON.parse(q1.body.toString());
    const q2Data = JSON.parse(q1.body.toString());
    const q3Data = JSON.parse(q1.body.toString());

    const response: Response = quizFinalResultsRequest(quizData.quizid, quizSession.sessionId, adminData.token);

    expect(response.statusCode).toStrictEqual(HttpStatusCode.OK);
    expect(JSON.parse(response.body.toString())).toStrictEqual(
      {
        'usersRankedByScore': [
          {
            'name': 'Hermione',
            'score': 60,
          },
          {
            'name': 'Harry',
            'score': 60,
          },
          {
            'name': 'Ron',
            'score': 30,
          }
        ],
        'questionResults': [
          {
            'questionId': q1Data.questionId,
            'playersCorrectList': [
              'Hermione',
              'Ron',
              'Harry'
            ],
            'averageAnswerTime': expect.any(Number),
            'percentCorrect': expect.any(Number)
          },
          {
            'questionId': q2Data.questionId,
            'playersCorrectList': [
              'Hermione',
              'Harry',
              'Ron'
            ],
            'averageAnswerTime': expect.any(Number),
            'percentCorrect': expect.any(Number)
          },
          {
            'questionId': q3Data.questionId,
            'playersCorrectList': [
              'Hermione',
              'Harry'
            ],
            'averageAnswerTime': expect.any(Number),
            'percentCorrect': expect.any(Number)
          }
        ]
      }
    );
  });
  test('/results/csv - Success: two players in 1st', () => {
    const datastr: Buffer = fs.readFileSync('./datastore.json');
    const data: Datastore = JSON.parse(String(datastr));
    const quizProfSession: Session = data.sessions.find(s => s.sessionId === quizSession.sessionId);

    // Harry's score changes to 60 -> equal 1st with Hermione
    quizProfSession.sessionPlayers[0].playerScore = 60;

    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());

    const response: Response = quizFinalResultsCSVRequest(quizData.quizid, quizSession.sessionId, adminData.token);

    expect(response.statusCode).toStrictEqual(HttpStatusCode.OK);
    expect(JSON.parse(response.body.toString())).toStrictEqual({ "url": "http://google.com/some/image/path.csv" });
  });
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
    const player1: Player = { playerId: 1, playerName: 'Harry', playerScore: 50 };

    // replace with startSession
    quizSession = {
      sessionId: 1234,
      sessionQuiz: quizProf,
      sessionState: 1,
      autoStartNum: 1,
      atQuestion: 1,
      sessionPlayers: [player1],
      messages: []
    }

    quiz2Session = {
      sessionId: 5678,
      sessionQuiz: quizPotato,
      sessionState: 1,
      autoStartNum: 1,
      atQuestion: 1,
      sessionPlayers: [player1],
      messages: []
    }
  });
  test('/results - Error: Session Id does not refer to a valid session within this quiz', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsRequest(quizData.quizid, quizSession.sessionId + 1, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('/results - Error: Session is not in FINAL_RESULTS state', () => {
    const datastr: Buffer = fs.readFileSync('./datastore.json');
    const data: Datastore = JSON.parse(String(datastr));
    const quizProfSession: Session = data.sessions.find(s => s.sessionId === quizSession.sessionId);
    // change state to be !FINAL_RESULTS
    quizProfSession.sessionState = 0;
    
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsRequest(quizData.quizid, quizSession.sessionId, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('/results - Error: Token is empty or invalid (does not refer to valid logged in user session)', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsRequest(quizData.quizid, quizSession.sessionId, adminData.token + 1);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  });
  test('/results - Error: Valid token is provided, but user is not authorised to view this session', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsRequest(quizData.quizid, quiz2Session.sessionId, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  });
  test('/results/csv - Error: Session Id does not refer to a valid session within this quiz', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsCSVRequest(quizData.quizid, quizSession.sessionId + 1, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('/results/csv - Error: Session is not in FINAL_RESULTS state', () => {
    const datastr: Buffer = fs.readFileSync('./datastore.json');
    const data: Datastore = JSON.parse(String(datastr));
    const quizProfSession: Session = data.sessions.find(s => s.sessionId === quizSession.sessionId);
    // change state to be !FINAL_RESULTS
    quizProfSession.sessionState = 0;
    
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsCSVRequest(quizData.quizid, quizSession.sessionId, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('/results/csv - Error: Token is empty or invalid (does not refer to valid logged in user session)', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsCSVRequest(quizData.quizid, quizSession.sessionId, adminData.token + 1);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  });
  test('/results/csv - Error: Valid token is provided, but user is not authorised to view this session', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResultsCSVRequest(quizData.quizid, quiz2Session.sessionId, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  });
});
