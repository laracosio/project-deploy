import { getUnixTime } from 'date-fns';
import { Session, SessionStatus, UTInfo, getData, Question, Player } from '../dataStore';
import { AdminActions, isAdminAction } from '../enums/AdminActions';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { SessionStates } from '../enums/SessionStates';
import { ApiError } from '../errors/ApiError';
import { StateError } from '../errors/StateError';
import { quizToMetadata } from '../utils/mappers';
import { SessionStateMachine } from './sesssionStateMachine';
import { AutomaticActions } from '../enums/AutomaticActions';
import { tokenValidation, findQuizById, findUTInfo, setAndSave, calcSubmittedAnsScore, createUserRank, calcAvgAnsTime, calcPercentCorrect, findPlayerName } from './otherService';
import { QuestionResultsReturn } from './playerService';

interface PlayerWithScores extends Player {
  playerScores?: PlayerScore[];
}

interface PlayerScore {
  questionId: number;
  score: number;
}

interface newSessionReturn {
  sessionId: number
}

interface Rank {
  name: string;
  score: number;
}

interface QuestionResults {
  questionId: number;
  playersCorrectList: string[];
  averageAnswerTime: number;
  percentCorrect: number;
}

interface QuizFinalResultsReturn {
  usersRankedByScore: Rank[];
  questionResults: QuestionResults[];
}

interface quizSessionsList {
  activeSessions: number[];
  inactiveSessions: number[];
}

interface IndividualRank {
  name: string;
  score: number;
  rank?: number;
}
interface Ranking {
  questionPosition: number;
  rankings: IndividualRank[]
}

interface PlayerSummary {
  name: string;
  question: {
    qPosition: number;
    qscore: number;
    qRank: number;
  }
}

interface qRankings {
  playerName: string;
  questionPosition: number;
  score: number;
  rank?: number;
}
/**
 * Given a particular quiz, start a new session
 * @param {string} token - unique token
 * @param {number} quizId - unique identifier for quiz
 * @param {number} autoStartNum - amount of players needed to join for quiz to start
 * @returns { newSessionReturn } - object containing sessionId
 * @returns {{error: string}}
*/
export function startNewSession(token: string, quizId: number, autoStartNum: number): newSessionReturn {
  const dataStore = getData();

  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  const matchedToken = findUTInfo(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== matchedToken.userId && q.quizId === quizId))) {
    throw new ApiError('User is not an owner of this quiz', HttpStatusCode.FORBIDDEN);
  }

  if (autoStartNum > 50) {
    throw new ApiError('autoStartNum cannot be a number greater than 50', HttpStatusCode.BAD_REQUEST);
  }

  // if 10 sessions with this quizId exist and are not in end state
  const filteredSession = dataStore.sessions.filter((s) => s.sessionQuiz.quizId === quizId && s.sessionState !== SessionStates.END);
  if (filteredSession.length >= 10) {
    throw new ApiError('The maximum of 10 sessions for this quiz that are not in END state already exist', HttpStatusCode.BAD_REQUEST);
  }

  const matchedQuiz = findQuizById(quizId);
  if (matchedQuiz.numQuestions === 0) {
    throw new ApiError('The quiz does not have any questions in it', HttpStatusCode.BAD_REQUEST);
  }

  const newSessionId: number = (dataStore.maxSessionId + 1);
  dataStore.maxSessionId = newSessionId;

  const newSession: Session = {
    sessionId: newSessionId,
    sessionQuiz: matchedQuiz,
    sessionState: SessionStates.LOBBY,
    autoStartNum: autoStartNum,
    atQuestion: 0,
    sessionPlayers: [],
    messages: [],
  };

  dataStore.sessions.push(newSession);
  setAndSave(dataStore);
  return { sessionId: newSessionId };
}
/**
 * Given quiz id and sessionid, return the current status of this quiz session
 * @param {number} quizId
 * @param {number} sessionId
 * @param {string} token
 * @returns {SessionStatus}
 * @returns { error: string }
 */
export function getSessionStatus(quizId: number, sessionId: number, token: string): SessionStatus {
  const dataStore = getData();
  const session: Session = dataStore.sessions.find(elem => elem.sessionId === sessionId);

  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  const authToken: UTInfo = findUTInfo(token);
  if (session.sessionQuiz.quizOwner !== authToken.userId) {
    throw new ApiError('User is not authorised to view this session', HttpStatusCode.FORBIDDEN);
  }

  const sessionsWithinQuiz = dataStore.sessions.filter(elem => elem.sessionQuiz.quizId === quizId);
  if (!sessionsWithinQuiz.some(elem => elem.sessionId === sessionId)) {
    throw new ApiError('Session Id does not refer to a valid session within this quiz', HttpStatusCode.BAD_REQUEST);
  }

  return {
    state: session.sessionState,
    atQuestion: session.atQuestion,
    players: session.sessionPlayers.map(player => player.playerName),
    metadata: quizToMetadata(session.sessionQuiz)
  };
}

/**
 * Given quiz id and sessionid, if provided token is valid quizOwner's token,
 * update the session's status using provided valid action
 * @param {number} quizId
 * @param {number} sessionId
 * @param {string} token
 * @param {string} action
 * @returns {}
 * @returns { error: string }
 */
export function updateSessionStatus(quizId: number, sessionId: number, token: string, action: string): void {
  const dataStore = getData();
  const session: Session = dataStore.sessions.find(elem => elem.sessionId === sessionId);

  console.log('testing autoStartNum = 3 with 3 players');
  console.log(`current action: ${action}`);
  console.log(`current session's state: ${session.sessionState}`);

  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  const authToken: UTInfo = findUTInfo(token);
  if (session.sessionQuiz.quizOwner !== authToken.userId) {
    throw new ApiError('User is not authorised to view this session', HttpStatusCode.FORBIDDEN);
  }

  const sessionsWithinQuiz = dataStore.sessions.filter(elem => elem.sessionQuiz.quizId === quizId);
  if (!sessionsWithinQuiz.some(elem => elem.sessionId === sessionId)) {
    throw new ApiError('Session Id does not refer to a valid session within this quiz', HttpStatusCode.BAD_REQUEST);
  }

  if (!isAdminAction(action)) {
    throw new ApiError(`Admin Action: ${action} is not valid`, HttpStatusCode.BAD_REQUEST);
  }

  // if the sessions is at the last question and its state is closed
  // if admin tries to go to next question this should go to final results instead
  if ((session.atQuestion === session.sessionQuiz.numQuestions) &&
      session.sessionState === SessionStates.QUESTION_CLOSE &&
      action === AdminActions.NEXT_QUESTION) {
    action = AdminActions.GO_TO_FINAL_RESULTS;
  }

  // try-catch executes changing state. If error will go to catch
  try {
    // updateState will change the state of the session and throw an error if invalid action given as next state
    const nextState = updateState(session, action as AdminActions);
    console.log(session.sessionState);
    if (nextState === SessionStates.QUESTION_CLOSE || nextState === SessionStates.ANSWER_SHOW) {
      const questionIndex = (session.atQuestion - 1);
      calcSubmittedAnsScore(session, questionIndex);
    }
    if (nextState === SessionStates.QUESTION_COUNTDOWN) {
      session.atQuestion++;
      setTimeout(() => {
        updateState(session, AutomaticActions.OPEN_QUESTION_AUTOMATIC);
      }, 3000);
    }
    if (nextState === SessionStates.QUESTION_OPEN) {
      const question = session.sessionQuiz.questions[session.atQuestion - 1];
      const currentUnixTime = getUnixTime(new Date());
      question.questionStartTime = currentUnixTime;
      setTimeout(() => {
        updateState(session, AutomaticActions.CLOSE_QUESTION_AUTOMATIC);
        const questionIndex = (session.atQuestion - 1);
        calcSubmittedAnsScore(session, questionIndex);
      }, question.duration * 1000);
    }
  } catch (e) {
    if (e instanceof StateError) {
      throw new ApiError(e.message, HttpStatusCode.BAD_REQUEST);
    }
    throw new ApiError('Something went wrong, please try again', HttpStatusCode.BAD_REQUEST);
  }
}

export function updateState(session: Session, action: AdminActions | AutomaticActions): SessionStates {
  try {
    const nextState = SessionStateMachine.getNextState(session.sessionState, action as AdminActions);
    session.sessionState = nextState;
    return nextState;
  } catch (e) {
    if (action in AdminActions) {
      throw e;
    } else {
      console.log('Failing gracefully for automatic state change failure');
    }
  }
}

/**
 * Given a particular quiz, view both active and inactive sessions
 * @param {string} token - unique token
 * @param {number} quizId - unique identifier for quiz
 * @returns { activeSessions: [{number}], inactiveSessions: [{number}] } - object containing 2 arrays of sessionIds
 * @returns {{error: string}}
 */
export function viewSessions(token: string, quizId: number): quizSessionsList {
  const dataStore = getData();

  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  const matchedToken = findUTInfo(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== matchedToken.userId && q.quizId === quizId))) {
    throw new ApiError('User is not an owner of this quiz', HttpStatusCode.FORBIDDEN);
  }

  const matchedQuiz = findQuizById(quizId);

  // Create an array for active sessions for particular quiz
  const quizActiveSessionList: number[] = [];
  dataStore.sessions.forEach((sess) => {
    if (sess.sessionQuiz === matchedQuiz && sess.sessionState !== SessionStates.END) {
      const obj = sess.sessionId;
      quizActiveSessionList.push(obj);
    }
  });
  quizActiveSessionList.sort(function(a, b) { return a - b; });

  // Create an array for inactive sessions for particular quiz
  const quizInactiveSessionList: number[] = [];
  dataStore.sessions.forEach((sess) => {
    if (sess.sessionQuiz === matchedQuiz && sess.sessionState === SessionStates.END) {
      const obj = sess.sessionId;
      quizInactiveSessionList.push(obj);
    }
  });
  quizInactiveSessionList.sort(function(a, b) { return a - b; });

  const quizSessionsList: quizSessionsList = { activeSessions: quizActiveSessionList, inactiveSessions: quizInactiveSessionList };

  return quizSessionsList;
}

/**
 * Get the final results for all players for a completed quiz session
 * @param quizId - id of quiz
 * @param sessionId - id of Session containing the quiz
 * @param token - token of auth user
 * @returns finalResults of the Session Quiz
 */
export function quizFinalResults(quizId: number, sessionId: number, token: string): QuizFinalResultsReturn {
  const dataStore = getData();
  const session: Session = dataStore.sessions.find(elem => elem.sessionId === sessionId);

  // 401 Token is empty or invalid (does not refer to valid logged in user session)
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // 403 Valid token is provided, but user is not authorised to view this session
  const authToken: UTInfo = findUTInfo(token);
  if (session.sessionQuiz.quizOwner !== authToken.userId) {
    throw new ApiError('User is not authorised to view this session', HttpStatusCode.FORBIDDEN);
  }

  // 400 Session Id does not refer to a valid session within this quiz
  const sessionsWithinQuiz = dataStore.sessions.filter(elem => elem.sessionQuiz.quizId === quizId);
  if (!sessionsWithinQuiz.some(elem => elem.sessionId === sessionId)) {
    throw new ApiError('Session Id does not refer to a valid session within this quiz', HttpStatusCode.BAD_REQUEST);
  }

  // 400 Session is not in FINAL_RESULTS state
  if (session.sessionState !== SessionStates.FINAL_RESULTS) {
    throw new ApiError('Something went wrong, please try again', HttpStatusCode.BAD_REQUEST);
  }

  const userRanking = createUserRank(session);

  const allQuestionResults: QuestionResultsReturn[] = [];
  let index = 0;
  session.sessionQuiz.questions.forEach(question => {
    const qResults: QuestionResultsReturn = {
      questionId: question.questionId,
      playersCorrectList: question.playerCorrectList,
      averageAnswerTime: calcAvgAnsTime(session, index),
      percentCorrect: calcPercentCorrect(session, index)
    };
    index++;
    allQuestionResults.push(qResults);
  });

  const finalResults: QuizFinalResultsReturn = {
    usersRankedByScore: userRanking,
    questionResults: allQuestionResults
  };

  return finalResults;
}

/**
 * Get the final results for all players for a completed quiz session
 * @param quizId - id of the quiz seeking results for
 * @param sessionId - sessionId corresponding to particular quiz game
 * @param token - token of authorised user
 * @returns csv containing result information
 */
export function quizFinalResultsCsv(quizId: number, sessionId: number, token: string): string[] {
  const dataStore = getData();
  const session: Session = dataStore.sessions.find(elem => elem.sessionId === sessionId);

  // 401 Token is empty or invalid (does not refer to valid logged in user session)
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // 403 Valid token is provided, but user is not authorised to view this session
  const authToken: UTInfo = findUTInfo(token);
  if (session.sessionQuiz.quizOwner !== authToken.userId) {
    throw new ApiError('User is not authorised to view this session', HttpStatusCode.FORBIDDEN);
  }

  // 400 Session Id does not refer to a valid session within this quiz
  const sessionsWithinQuiz = dataStore.sessions.filter(elem => elem.sessionQuiz.quizId === quizId);
  if (!sessionsWithinQuiz.some(elem => elem.sessionId === sessionId)) {
    throw new ApiError('Session Id does not refer to a valid session within this quiz', HttpStatusCode.BAD_REQUEST);
  }

  // 400 Session is not in FINAL_RESULTS state
  if (session.sessionState !== SessionStates.FINAL_RESULTS) {
    throw new ApiError('Something went wrong, please try again', HttpStatusCode.BAD_REQUEST);
  }

  return createQuizResultsCsv(session);
}

function enrichWithScores(questions: Question[], players: Player[]): PlayerWithScores[] {
  return players.map(player => {
    return {
      ...player,
      playerScores: questions.map(question => {
        const submittedAnswer = question.submittedAnswers.find(answer => answer.playerId === player.playerId);
        return {
          questionId: question.questionId,
          score: submittedAnswer.questionScore
        };
      })
    };
  });
}

function createQuizResultsCsv(session: Session): string[] {
  const questions: Question[] = session.sessionQuiz.questions;
  const players: Player[] = session.sessionPlayers;

  const sortedPlayers = players.sort((a, b) => {
    if (a.playerName < b.playerName) {
      return -1;
    }
    if (a.playerName > b.playerName) {
      return 1;
    }
    return 0;
  });
  const sortedPlayersWithScores: PlayerWithScores[] = enrichWithScores(questions, sortedPlayers);

  // get list of questions with all players scores and ranks
  const questionsWithScoresAndRank = questions.map(question => {
  // get list of scores for each player, with each each index + 1 being the corresponding question number

    const scores = sortedPlayersWithScores.map(player => {
      const playerAnswer = player.playerScores.find(playerAnswer => playerAnswer.questionId === question.questionId);
      return {
        playerId: player.playerId,
        score: playerAnswer ? playerAnswer.score : 0
      };
    });
    const sortedScores = scores.sort((a, b) => (b.score) - (a.score));
    let rank = 1;

    // get ranks for each player, with each index + 1 being the corresponding question number
    const ranks = sortedScores.map((answer, idx) => {
      if (idx > 0 && answer.score < sortedScores[idx - 1].score) {
        rank = idx + 1;
      }
      return {
        playerId: answer.playerId,
        rank: rank
      };
    });

    return {
      id: question.questionId,
      scores: scores,
      ranks: ranks
    };
  });

  // add header to csv list
  const header = ['Player'];
  questions.forEach((elem, idx) => {
    header.push(`question${idx + 1}score`);
    header.push(`question${idx + 1}rank`);
  });
  const csvData = [header.join(',')];

  // add players score and rank to csv list
  sortedPlayers.forEach(player => {
    const row = [player.playerName];
    questionsWithScoresAndRank.forEach((elem, idx) => {
      row.push(elem.scores.find(score => score.playerId === player.playerId).score.toString());
      row.push(elem.ranks.find(rank => rank.playerId === player.playerId).rank.toString());
    });
    csvData.push(row.join(','));
  });

  return csvData;
}
