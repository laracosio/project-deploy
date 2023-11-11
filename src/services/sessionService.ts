import { Token, getData, Session } from "../dataStore"
import { HttpStatusCode } from "../enums/HttpStatusCode"
import { SessionStates } from "../enums/SessionStates"
import { ApiError } from "../errors/ApiError"
import { findToken, tokenValidation } from "./otherService"

interface Rank {
  name: string,
  score: number
}

interface QuestionResults {
  questionId: number,
  playersCorrectList: string[],
  averageAnswerTime: number,
  percentCorrect: number
}

interface QuizFinalResultsReturn {
  usersRankedByScore: Rank[],
  questionResults: QuestionResults[],
}

export function quizFinalResults(quizId: number, sessionId: number, token: string): QuizFinalResultsReturn {
  const dataStore = getData();
  const session: Session = dataStore.sessions.find(elem => elem.sessionId === sessionId);
  
  // 401 Token is empty or invalid (does not refer to valid logged in user session)
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // 403 Valid token is provided, but user is not authorised to view this session
  const authToken: Token = findToken(token);
  if (session.sessionQuiz.quizOwner !== authToken.userId) {
    throw new ApiError('User is not authorised to view this session', HttpStatusCode.FORBIDDEN);
  }
  
  // 400 Session Id does not refer to a valid session within this quiz
  const sessionsWithinQuiz = dataStore.sessions.filter(elem => elem.sessionQuiz.quizId === quizId);
  if (!sessionsWithinQuiz.some(elem => elem.sessionId === sessionId)) {
    throw new ApiError('Session Id does not refer to a valid session within this quiz', HttpStatusCode.BAD_REQUEST);
  }
  
  // 400 Session is not in FINAL_RESULTS state
  if (session.sessionState != SessionStates.FINAL_RESULTS) {
    throw new ApiError('Something went wrong, please try again', HttpStatusCode.BAD_REQUEST);
  }

  const rankList = [...session.sessionPlayers]
    .sort((a, b) => a.playerScore - b.playerScore)
    .map(elem => {
      return {
        name: elem.playerName,
        score: elem.playerScore
      }
    });

  const questionList = [...session.sessionQuiz.questions].map(elem => {
    return {
      questionId: elem.questionId,
      playersCorrectList: elem.playersCorrectList,
      averageAnswerTime: elem.averageAnswerTime,
      percentCorrect: elem.percentCorrect
    }
  });

  const finalResults: QuizFinalResultsReturn = {
    usersRankedByScore: rankList,
    questionResults: questionList
  }

  return finalResults;
}
