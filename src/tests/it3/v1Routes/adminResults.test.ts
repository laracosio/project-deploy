import { Response } from 'sync-request-curl';
import { HttpStatusCode } from '../../../enums/HttpStatusCode';
import { createQuizQuestionRequestV2, quizFinalResults } from '../../serverTestHelperIt3';
import { person1 } from '../../../testingData';
import { authRegisterRequest, quizCreateRequest } from '../../it2Testing/serverTestHelperIt2';
import { Datastore, Player, QuestionCreate, Quiz, Session } from '../../../dataStore';
import fs from 'fs';
import { setAndSave } from '../../../features/other';

// quizFinalResults tests
describe('GET /v1/admin/quiz/{quizid}/session/{sessionid}/results', () => {
  let admin: Response, quiz: Response, q1: Response, q2: Response, q3: Response, quizSession: Session;
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
  test('Success - all players have different results', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const q1Data = JSON.parse(q1.body.toString());
    const q2Data = JSON.parse(q1.body.toString());
    const q3Data = JSON.parse(q1.body.toString());

    const response: Response = quizFinalResults(quizData.quizid, quizSession.sessionId, adminData.token);

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
  test('Success - two players in 1st', () => {
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

    const response: Response = quizFinalResults(quizData.quizid, quizSession.sessionId, adminData.token);

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
});

describe('GET /v1/admin/quiz/{quizid}/session/{sessionid}/results - Error Cases', () => {
  let admin: Response, quiz: Response, quizSession: Session;
  beforeEach(() => {
    const { email, password, nameFirst, nameLast } = person1;
    admin = authRegisterRequest(email, password, nameFirst, nameLast);
    const adminData = JSON.parse(admin.body.toString());

    quiz = quizCreateRequest(adminData.token, 'Name That Professor', 'Hogwarts Professors');
    const quizData = JSON.parse(quiz.body.toString());

    const datastr: Buffer = fs.readFileSync('./datastore.json');
    const data: Datastore = JSON.parse(String(datastr));
    const quizProf: Quiz = data.quizzes.find(quiz => quiz.quizId === quizData.quizId);
    
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
  });
  test('Session Id does not refer to a valid session within this quiz', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResults(quizData.quizid, quizSession.sessionId + 1, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('Session is not in FINAL_RESULTS state', () => {
    const datastr: Buffer = fs.readFileSync('./datastore.json');
    const data: Datastore = JSON.parse(String(datastr));
    const quizProfSession: Session = data.sessions.find(s => s.sessionId === quizSession.sessionId);

    // change state to be !FINAL_RESULTS
    quizProfSession.sessionState = 0;
    
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResults(quizData.quizid, quizSession.sessionId, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.BAD_REQUEST);
  });
  test('Token is empty or invalid (does not refer to valid logged in user session)', () => {
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResults(quizData.quizid, quizSession.sessionId, adminData.token + 1);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.UNAUTHORISED);
  });
  test('Valid token is provided, but user is not authorised to view this session', () => {
    
    const adminData = JSON.parse(admin.body.toString());
    const quizData = JSON.parse(quiz.body.toString());
    const response: Response = quizFinalResults(quizData.quizid, quizSession.sessionId, adminData.token);
    expect(response.statusCode).toStrictEqual(HttpStatusCode.FORBIDDEN);
  });
});

// quizFinalResultsCSV tests
