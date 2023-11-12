import { Token, getData, Session } from "../dataStore"
import { HttpStatusCode } from "../enums/HttpStatusCode"
import { SessionStates } from "../enums/SessionStates"
import { ApiError } from "../errors/ApiError"
import { findToken, tokenValidation } from "./otherService"
import { PlayerAnswers } from "../dataStore"

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
  console.log(`func ${quizId}, ${sessionId}, ${token}`);
  const dataStore = getData();
  const session: Session = dataStore.sessions.find(elem => elem.sessionId === sessionId);
  console.log(dataStore);
  
  // 401 Token is empty or invalid (does not refer to valid logged in user session)
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // 403 Valid token is provided, but user is not authorised to view this session
  const authToken: Token = findToken(token);
  if (session.sessionQuiz.quizOwner !== authToken.userId) {
    throw new ApiError('User is not authorised to view this session', HttpStatusCode.FORBIDDEN);
  }
 
  console.log(dataStore.sessions);
  console.log(dataStore.sessions[0]);
  // 400 Session Id does not refer to a valid session within this quiz
  const sessionsWithinQuiz = dataStore.sessions.filter(elem => elem.sessionQuiz.quizId === quizId);
  console.log(sessionsWithinQuiz);
  if (!sessionsWithinQuiz.some(elem => elem.sessionId === sessionId)) {
    console.log('baggy');
    throw new ApiError('Session Id does not refer to a valid session within this quiz', HttpStatusCode.BAD_REQUEST);
  }
  
  // 400 Session is not in FINAL_RESULTS state
  if (session.sessionState != SessionStates.FINAL_RESULTS) {
    console.log('pants');
    console.log(session);
    console.log(session.sessionState);
    // throw new ApiError('Something went wrong, please try again', HttpStatusCode.BAD_REQUEST);
  }



  const rankList = [...session.sessionPlayers]
    .sort((a, b) => playerScore(b.playerAnswers) - playerScore(a.playerAnswers))
    .map(elem => {
      return {
        name: elem.playerName,
        score: playerScore(elem.playerAnswers)
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

function playerScore(playerAnswers: PlayerAnswers[]): number {
  let playerScore: number = 0;
  playerAnswers.forEach(q => {
    playerScore += q.score;
  });
  return playerScore;
}
