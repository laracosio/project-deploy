import { Session, SessionStatus, Token, getData, Player, Message } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { quizToMetadata } from '../utils/mappers';
import { findToken, tokenValidation, findQuizById } from './otherService';

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

  const matchedToken = findToken(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== matchedToken.userId && q.quizId === quizId))) {
    throw new ApiError('User is not an owner of this quiz', HttpStatusCode.FORBIDDEN);
  }

  if (autoStartNum > 50) {
    throw new ApiError('autoStartNum cannot be a number greater than 50', HttpStatusCode.BAD_REQUEST);
  }

  //needs another part of if statement
  if (dataStore.sessions.length >= 10 &&) {
    throw new ApiError('The maximum of 10 sessions that are not in END state already exist', HttpStatusCode.BAD_REQUEST);
  }

  const Quiz = findQuizById(quizId);
  if (Quiz.numQuestions === 0) {
    throw new ApiError('The quiz does not have any questions in it', HttpStatusCode.BAD_REQUEST);
  }

  const newSessionId: number = (dataStore.maxSessionId + 1);
  dataStore.maxSessionId = newSessionId;

  const newSession: Session = {
    sessionId: newSessionId,
    sessionQuiz: Quiz,
    sessionState: 1,
    autoStartNum: autoStartNum,
    atQuestion: 1,
    sessionPlayers: Player[],
    messages: Message[],
  };

  dataStore.sessions.push(newSession);
  setAndSave(dataStore);
  return {sessionId: newSessionId};
}