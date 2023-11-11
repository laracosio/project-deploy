import { HttpStatusCode } from "../enums/HttpStatusCode";
import { findSessionByPlayerId, playerValidation } from "./otherService";
import { ApiError } from '../errors/ApiError';
import { getData } from "../dataStore";
import { SessionStates } from "../enums/SessionStates";

interface PQResultReturn {
  questionId: number;
  playersCorrectList: string[];
  averageAnswerTime: number;
  percentCorrect: number;
}

/**
 * Get the results for a particular question of the session a player is playing in
 * @param playerId 
 * @param questionPosition 
 */
function playerQuestionResult(playerId: number, questionPosition: number): PQResultReturn {
  const dataStore = getData();

  if (!playerValidation) {
    throw new ApiError('Player is invalid', HttpStatusCode.BAD_REQUEST);
  }

  const matchedSession = findSessionByPlayerId(playerId);
  if (questionPosition < 0 || questionPosition > matchedSession.sessionQuiz.numQuestions) {
    throw new ApiError('Question position is not valid for the session this player is in', HttpStatusCode.BAD_REQUEST);
  }

  if (matchedSession.sessionState !== SessionStates.ANSWER_SHOW) {
    throw new ApiError('Session is not yet up to this question', HttpStatusCode.BAD_REQUEST);
  }
  
  if (matchedSession.atQuestion !== questionPosition) {
    throw new ApiError('Session is not yet up to this question', HttpStatusCode.BAD_REQUEST);
  }
  
  const matchedQuestion = matchedSession.sessionQuiz.questions[questionPosition - 1];
  const totalSessionPlayers = dataStore.mapPS.filter(elem => elem.sessionId === matchedSession.sessionId).length;
  const avgTime = matchedQuestion.answerTimes.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const newPQResultObj = {
    questionId: matchedQuestion.questionId,
    playersCorrectList: matchedQuestion.playersCorrectList,
    averageAnswerTime: Math.round((avgTime/totalSessionPlayers)* 10 / 10),
    percentCorrect: Math.round((matchedQuestion.playersCorrectList.length)/totalSessionPlayers)
  }
  
  return newPQResultObj;
}

export {
  playerQuestionResult
}