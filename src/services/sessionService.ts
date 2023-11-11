import { Session, SessionStatus, Token, getData } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { quizToMetadata } from '../utils/mappers';
import { findToken, tokenValidation } from './otherService';

/**
 * Given a particular quiz, start a new session
 * @param {string} tokenId - unique token
 * @param {number} quizId - unique identifier for quiz
 * @param {number} autoStartNum - amount of players needed to join for quiz to start
 * @returns {{error: string}}
 */
function startNewSession(sessionId: string, quizId: number, autoStartNum: number): object {
  const dataStore = getData();
  setAndSave(dataStore);
  return {};
}