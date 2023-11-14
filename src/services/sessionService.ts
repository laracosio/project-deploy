import { Session, getData } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { SessionStates } from '../enums/SessionStates';
import { ApiError } from '../errors/ApiError';
import { tokenValidation, findQuizById, findUTInfo, setAndSave } from './otherService';

interface newSessionReturn {
  sessionId: number
}

/**
 * Given a particular quiz, start a new session
 * @param {string} token - unique token
 * @param {number} quizId - unique identifier for quiz
 * @param {number} autoStartNum - amount of players needed to join for quiz to start
 * @returns { newSessionReturn } - object containing sessionId
 * @returns {{error: string}}
 */
function startNewSession(token: string, quizId: number, autoStartNum: number): newSessionReturn {
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

export { startNewSession };
import { UTInfo, getData, Session } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { SessionStates } from '../enums/SessionStates';
import { ApiError } from '../errors/ApiError';
import { findUTInfo, tokenValidation } from './otherService';
import { PlayerAnswers } from '../dataStore';

interface Rank {
  name: string;
  score: number;
}

interface QuestionResults {
  questionId: number;
  playersCorrectList: string[];
  averageAnswerTime: number;
  percentCorrect: number;
}

interface QuizFinalResultsReturn {
  usersRankedByScore: Rank[];
  questionResults: QuestionResults[];
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

  const usersRankedByScore = [...session.sessionPlayers]
    .sort((a, b) => playerScore(b.playerAnswers) - playerScore(a.playerAnswers))
    .map(elem => {
      return {
        name: elem.playerName,
        score: playerScore(elem.playerAnswers)
      };
    });

  const questionResults = [...session.sessionQuiz.questions].map(elem => {
    const noOfAnswers = elem.answerTimes.length;
    const sumOfAnswers = -1;

    const averageAnswerTime = sumOfAnswers / noOfAnswers;
    const percentCorrect = Math.round((elem.playersCorrectList.length / session.sessionPlayers.length) * 100);
    return {
      questionId: elem.questionId,
      playersCorrectList: elem.playersCorrectList,
      averageAnswerTime: averageAnswerTime,
      percentCorrect: percentCorrect
    };
  });

  const finalResults: QuizFinalResultsReturn = {
    usersRankedByScore: usersRankedByScore,
    questionResults: questionResults
  };

  return finalResults;
}

function playerScore(playerAnswers: PlayerAnswers[]): number {
  let playerScore: number = 0;
  playerAnswers.forEach(q => {
    playerScore += q.score;
  });
  return playerScore;
}
