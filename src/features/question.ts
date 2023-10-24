// import statements
import { getUnixTime } from 'date-fns';
import { getData, setData } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { findQuestionbyQuiz, findQuizById, findToken, tokenValidation } from './other';

// interfaces
// interface CreateQuestionReturn {
//   questionId: number
//   }

/**
 * Move a question from one particular position in the quiz to another
 * When this route is called, the timeLastEdited is updated
 * @param sessionId - sessionId contained within a token
 * @param quizId - quizId where question exists
 * @param questionId - question to move
 * @param newPostion - position to move question to
 * @returns - {} OR error
 */
function moveQuestion(sessionId: string, quizId: number, questionId: number, newPosition: number): object {
  const dataStore = getData();

  // quiz invalid
  const matchedQuiz = findQuizById(quizId);
  if (matchedQuiz === undefined) {
    throw new ApiError('Quiz ID does not refer to a valid quiz', HttpStatusCode.BAD_REQUEST);
  }
  // question invalid
  const matchedQuestion = findQuestionbyQuiz(matchedQuiz, questionId);
  if (matchedQuestion === undefined) {
    throw new ApiError('Question Id does not refer to a valid question within this quiz', HttpStatusCode.BAD_REQUEST);
  }
  // newPosition invalid
  if (newPosition < 0 || (newPosition === (matchedQuiz.questions.length - 1))) {
    throw new ApiError('NewPosition is less than 0, or NewPosition is greater than n-1 where n is the number of questions', HttpStatusCode.BAD_REQUEST);
  }
  // position is the position of current question
  const currentIndex = matchedQuiz.questions.findIndex(element => element.questionId === questionId);
  if (currentIndex === newPosition) {
    throw new ApiError('NewPosition is the position of the current question', HttpStatusCode.BAD_REQUEST);
  }
  // invalid token
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Token is empty or invalid (does not refer to valid logged in user session)', HttpStatusCode.UNAUTHORISED);
  }
  // valid token but not quizOwner
  const matchedToken = findToken(sessionId);
  if (matchedToken.userId !== matchedQuiz.quizOwner) {
    throw new ApiError('Valid token is provided, but user is not an owner of this quiz', HttpStatusCode.FORBIDDEN);
  }

  const questionToMove = matchedQuiz.questions.splice(currentIndex, 1)[0];
  matchedQuiz.questions.splice(newPosition, 0, questionToMove);
  matchedQuiz.timeLastEdited = getUnixTime(new Date());

  setData(dataStore);
  return {};
}

export { moveQuestion };
