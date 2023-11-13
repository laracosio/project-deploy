import { HttpStatusCode } from "../enums/HttpStatusCode";
import { calcAvgAnsTime, calcPercentCorrect, createQuestionResults, createUserRank, findSessionByPlayerId, playerValidation } from "./otherService";
import { ApiError } from '../errors/ApiError';
import { getData } from "../dataStore";
import { SessionStates } from "../enums/SessionStates";

export interface UserRanking {
  name: string, 
  score: number
}

export interface questionResultsReturn {
  questionId: number;
  playersCorrectList: string[];
  averageAnswerTime: number;
  percentCorrect: number;
}

interface PlyrFinRsltReturn {
  userRankedByScore: UserRanking[],
  questionResults: questionResultsReturn[],
}

/**
 * Get the results for a particular question of the session a player is playing in
 * @param playerId 
 * @param questionPosition 
 */
export function playerQuestionResults(playerId: number, questionPosition: number): questionResultsReturn {
  const dataStore = getData();

  if (!playerValidation) {
    throw new ApiError('Player is invalid', HttpStatusCode.BAD_REQUEST);
  }

  const matchedSession = findSessionByPlayerId(playerId);
  if (questionPosition < 1 || questionPosition > matchedSession.sessionQuiz.numQuestions) {
    throw new ApiError('Question position is not valid for the session this player is in', HttpStatusCode.BAD_REQUEST);
  }

  if (matchedSession.sessionState !== SessionStates.ANSWER_SHOW) {
    throw new ApiError('Session is not yet up to this question', HttpStatusCode.BAD_REQUEST);
  }
  
  if (matchedSession.atQuestion !== questionPosition) {
    throw new ApiError('Session is not yet up to this question', HttpStatusCode.BAD_REQUEST);
  }
  
  const questionIndex = questionPosition - 1;
  const matchedQuestion = matchedSession.sessionQuiz.questions[questionIndex];
  const totalSessionPlayers = dataStore.mapPS.filter(elem => elem.sessionId === matchedSession.sessionId).length;

  return createQuestionResults(matchedQuestion, totalSessionPlayers);
}

export function playerFinalResults(playerId: number): PlyrFinRsltReturn {
  const dataStore = getData();

  if (!playerValidation) {
    throw new ApiError('Player is invalid', HttpStatusCode.BAD_REQUEST);
  }

  const matchedSession = findSessionByPlayerId(playerId);
  if (matchedSession.sessionState !== SessionStates.FINAL_RESULTS) {
    throw new ApiError('Session is not in FINAL_RESULTS state', HttpStatusCode.BAD_REQUEST);
  }

  const matchedSessionPlayers = matchedSession.sessionPlayers;
  const userRanking = createUserRank(matchedSessionPlayers);

  const totalSessionPlayers = dataStore.mapPS.filter(elem => elem.sessionId === matchedSession.sessionId).length;
  
  const questionResults: questionResultsReturn[] = [];
  matchedSession.sessionQuiz.questions.map(question => {
    questionResults.push(createQuestionResults(question, totalSessionPlayers))
  })

  return {
    userRankedByScore: userRanking,
    questionResults: questionResults
  }

}