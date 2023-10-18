import { getData, setData } from '../dataStore';
import { ApiError } from '../errors/ApiError';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { tokenValidation, findTokenUser } from './other';
import { getUnixTime } from 'date-fns';

/**
 * Given a particular quiz, permanently remove the quiz.
 * @param {string} token - unique token containing sessionId
 * @param {number} quizId - unique identifier for quiz
 * @returns {{error: string}}
 */
function adminQuizRemove(token:string, quizId: number): object {
  const dataStore = getData();
  // check that quizId is not empty or is valid
  if (!quizId || !dataStore.quizzes.some(q => q.quizId === quizId)) {
    throw new ApiError('Invalid quizId', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Invalid quizId' };
  }

  // check that token is not empty or is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
    // return { error: 'Invalid token' };
  }

  // find user associated with token and checks whether they are the quiz owner
  const tokenUser = findTokenUser(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== tokenUser.userId && q.quizId === quizId))) {
    throw new ApiError('User does not own quiz to remove', HttpStatusCode.UNAUTHORISED);
    // return { error: 'User does not own quiz to remove' };
  }

  const quizIndex: number = dataStore.quizzes.findIndex(quiz => quiz.quizId === quizId);
  const trashQuiz = dataStore.quizzes.splice(quizIndex, 1)[0];
  trashQuiz.timeLastEdited = getUnixTime(new Date());
  dataStore.trash.push(trashQuiz);

  setData(dataStore);
  return {};
}

export { adminQuizRemove };
