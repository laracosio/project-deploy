import { getData, setData } from '../dataStore';
import { ApiError } from '../errors/ApiError';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { tokenValidation, findToken, findQuizById } from './other';
import { getUnixTime } from 'date-fns';

/**
 * Given a particular quiz, send it to the trash (can be recovered later)
 * @param {string} sessionId - unique token containing sessionId
 * @param {number} quizId - unique identifier for quiz
 * @returns {{error: string}}
 */
function adminQuizRemove(sessionId: string, quizId: number): object {
  const dataStore = getData();
  const matchedQuiz = findQuizById(quizId);
  // check that quizId is not empty or is valid
  if (!quizId || matchedQuiz === undefined) {
    throw new ApiError('Invalid quizId', HttpStatusCode.BAD_REQUEST);
  }

  // check that sessionId is not empty or is valid
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // find user associated with token and checks whether they are the quiz owner
  const matchedToken = findToken(sessionId);
  if (matchedQuiz.quizOwner !== matchedToken.userId) {
    throw new ApiError('User does not own quiz to remove', HttpStatusCode.FORBIDDEN);
  }

  const quizIndex: number = dataStore.quizzes.findIndex(quiz => quiz.quizId === quizId);
  const trashQuiz = dataStore.quizzes.splice(quizIndex, 1)[0];
  trashQuiz.timeLastEdited = getUnixTime(new Date());
  dataStore.trash.push(trashQuiz);

  setData(dataStore);
  return {};
}

function quizRemoveQuestion (sessionToken: string, quizId: number, questionId: number): object {
  const dataStore = getData();

  const quiz = dataStore.quizzes.find(quiz => quiz.quizId === quizId);
  if (!quiz.questions.some((question) => question.questionId === questionId)) {
    throw new ApiError('Question Id does not refer to a valid question within this quiz', HttpStatusCode.BAD_REQUEST);
  }

  if (!tokenValidation(sessionToken)) {
    throw new ApiError('Token is empty or invalid', HttpStatusCode.UNAUTHORISED);
  }

  const authUser = dataStore.tokens.find(user => user.sessionId === sessionToken);
  if (quiz.quizOwner !== authUser.userId) {
    throw new ApiError('Valid token is provided, but user is not an owner of this quiz', HttpStatusCode.FORBIDDEN);
  }

  const questionIndex: number = quiz.questions.findIndex(question => question.questionId === questionId);
  quiz.questions.splice(questionIndex, 1);

  quiz.timeLastEdited = getUnixTime(new Date());

  setData(dataStore);

  return {};
}

export {
  adminQuizRemove, quizRemoveQuestion
};
