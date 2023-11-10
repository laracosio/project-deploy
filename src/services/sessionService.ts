import { Session, SessionStatus, Token, getData } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { quizToMetadata } from '../utils/mappers';
import { findToken, tokenValidation } from './otherService';
import { adminQuizInfo, QuizInfoReturn } from './quizService';

export function getSessionState(quizId: number, sessionId: number, token: string): SessionStatus {
  const dataStore = getData();
  const quiz: QuizInfoReturn = adminQuizInfo(token, quizId);
  const session: Session = dataStore.sessions.find((elem) => elem.sessionId === sessionId);

  // check that sessionId is not empty or is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // 403
  const authToken: Token = findToken(token);
  if (session.sessionQuiz.quizOwner !== authToken.userId) {
    throw new ApiError('User is not authorised to view this session', HttpStatusCode.FORBIDDEN);
  }

  // 400
  const sessionsWithinQuiz = dataStore.sessions.filter((elem) => elem.sessionQuiz.quizId === quizId);
  if (!sessionsWithinQuiz.some((elem) => elem.sessionId === sessionId)) {
    throw new ApiError('Session Id does not refer to a valid session within this quiz', HttpStatusCode.BAD_REQUEST);
  }

  return {
    state: session.sessionState,
    atQuestion: session.atQuestion,
    players: session.sessionPlayers.map((player) => player.playerName),
    metadata: quizToMetadata(session.sessionQuiz)
  };
}
