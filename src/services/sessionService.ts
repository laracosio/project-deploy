import { getUnixTime } from 'date-fns';
import { Session, SessionStatus, UTInfo, getData } from '../dataStore';
import { AdminActions, isAdminAction } from '../enums/AdminActions';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { SessionStates } from '../enums/SessionStates';
import { ApiError } from '../errors/ApiError';
import { StateError } from '../errors/StateError';
import { quizToMetadata } from '../utils/mappers';
import { SessionStateMachine } from './sesssionStateMachine';
import { AutomaticActions } from '../enums/AutomaticActions';
import { tokenValidation, findQuizById, findUTInfo, setAndSave, calcSubmittedAnsScore } from './otherService';

interface newSessionReturn {
  sessionId: number
}

interface quizSessionsList {
  activeSessions: number[];
  inactiveSessions: number[];
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
    atQuestion: 1,
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
    if (action === SessionStates.QUESTION_CLOSE || action === SessionStates.ANSWER_SHOW) {
      const questionIndex = (session.atQuestion - 1);
      calcSubmittedAnsScore(session, questionIndex);
    }
    if (nextState === SessionStates.QUESTION_COUNTDOWN) {
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
  quizActiveSessionList.sort(function(a, b){return a - b});


  // Create an array for inactive sessions for particular quiz
  const quizInactiveSessionList: number[] = [];
  dataStore.sessions.forEach((sess) => {
    if (sess.sessionQuiz === matchedQuiz && sess.sessionState === SessionStates.END) {
      const obj = sess.sessionId;
      quizInactiveSessionList.push(obj);
    }
  });
  quizInactiveSessionList.sort(function(a, b){return a - b});


  const quizSessionsList: quizSessionsList = { activeSessions: quizActiveSessionList, inactiveSessions: quizInactiveSessionList };

  return quizSessionsList;
}
