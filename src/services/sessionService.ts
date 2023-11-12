import { getUnixTime } from 'date-fns';
import { Session, SessionStatus, UTInfo, getData } from '../dataStore';
import { AdminActions, isAdminAction } from '../enums/AdminActions';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { SessionStates } from '../enums/SessionStates';
import { ApiError } from '../errors/ApiError';
import { StateError } from '../errors/StateError';
import { quizToMetadata } from '../utils/mappers';
import { findUTInfo, tokenValidation } from './otherService';
import { SessionStateMachine } from './sesssionStateMachine';
import { AutomaticActions } from '../enums/AutomaticActions';

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

  const authToken: Token = findToken(token);
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
  try {
    const nextState = updateState(session, action as AdminActions);
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
      console.log('Failing gracefully for automatic state change failure')
    }
  }
}
