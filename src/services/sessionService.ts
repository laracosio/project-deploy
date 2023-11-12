import { Session, SessionStatus, Token, getData, Player, Message, setData } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { SessionStates } from '../enums/SessionStates';
import { ApiError } from '../errors/ApiError';
import { quizToMetadata } from '../utils/mappers';
import { findUTInfo, tokenValidation, findQuizById } from './otherService';

/**
 * Given a particular quiz, start a new session
 * @param {string} tokenId - unique token
 * @param {number} quizId - unique identifier for quiz
 * @param {number} autoStartNum - amount of players needed to join for quiz to start
 * @returns {{error: string}}
 */
function startNewSession(token: string, quizId: number, autoStartNum: number): object {
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
  
  const Quiz = findQuizById(quizId);
  if (dataStore.sessions.filter((s) => s.sessionQuiz === Quiz).length >= 10 && dataStore.sessions.some((s) => s.sessionQuiz === Quiz && s.sessionState != SessionStates.END )) {
    throw new ApiError('The maximum of 10 sessions for this quiz that are not in END state already exist', HttpStatusCode.BAD_REQUEST);
  }

  if (Quiz.numQuestions === 0) {
    throw new ApiError('The quiz does not have any questions in it', HttpStatusCode.BAD_REQUEST);
  }

  const newSessionId: number = (dataStore.maxSessionId + 1);
  dataStore.maxSessionId = newSessionId;

  const newSession: Session = {
    sessionId: newSessionId,
    sessionQuiz: Quiz,
    sessionState: SessionStates.LOBBY,
    autoStartNum: autoStartNum,
    atQuestion: 1,
    sessionPlayers: [],
    messages: [],
  };

  dataStore.sessions.push(newSession);
  setData(dataStore);
  return {sessionId: newSessionId};
}

export { startNewSession }