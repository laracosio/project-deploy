import { getData, setData } from '../dataStore';
import { ApiError } from '../errors/ApiError';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { tokenValidation, findTokenUser } from './other';
import { getUnixTime } from 'date-fns';

interface BriefTrashQuizInfo {
  quizId: number,
  name: string
}

interface userTrashQuizList {
  trash: BriefTrashQuizInfo[]
}

/**
 * Given a particular quiz, permanently remove the quiz.
 * @param {string} sessionId - unique token containing sessionId
 * @param {number} quizId - unique identifier for quiz
 * @returns {{error: string}}
 */
function adminQuizRemove(sessionId: string, quizId: number): object {
  const dataStore = getData();
  // check that quizId is not empty or is valid
  if (!quizId || !dataStore.quizzes.some(q => q.quizId === quizId)) {
    throw new ApiError('Invalid quizId', HttpStatusCode.BAD_REQUEST);
  }

  // check that sessionId is not empty or is valid
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // find user associated with token and checks whether they are the quiz owner
  const tokenUser = findTokenUser(sessionId);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== tokenUser.userId && q.quizId === quizId))) {
    throw new ApiError('User does not own quiz to remove', HttpStatusCode.FORBIDDEN);
  }

  const quizIndex: number = dataStore.quizzes.findIndex(quiz => quiz.quizId === quizId);
  const trashQuiz = dataStore.quizzes.splice(quizIndex, 1)[0];
  trashQuiz.timeLastEdited = getUnixTime(new Date());
  dataStore.trash.push(trashQuiz);

  setData(dataStore);
  return {};
}

/**
 * Provide a list of all quizzes in the trash that are owned by the currently logged in user.
 * @param {string} sessionId - unique token containing sessionId
 * @returns {{error: string}}
 */
function adminQuizViewTrash(sessionId: string, quizId: number): userTrashQuizList {
  const dataStore = getData();

  // check that sessionId is not empty or is valid
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // find all user quizzes in the trash and add to an array
  const tokenUser = findTokenUser(sessionId);
  const userTrashQuizList: Array<BriefTrashQuizInfo> = [];
  dataStore.trash.forEach((quiz) => {
    if (quiz.quizOwner === tokenUser.userId) {
      const obj = {
        quizId: quiz.quizId,
        name: quiz.name,
      };
      userTrashQuizList.push(obj);
    }
  });

  return {
    trash: userTrashQuizList
  };
}

/**
 * Given a particular quiz in the user's trash, restore it.
 * @param {string} sessionId
 * @param {number} quizId
 * @returns {{error: string}}
 */
function adminQuizRestoreTrash (sessionId: string, quizId: number): object {
  const dataStore = getData();

  //declare index to access quiz in array that the quizId parameter refers to
  const index = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === tokenUser.userId && quiz.quizId === quizId));

  // check sessionId is valid
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // check quizId refers to quiz in trash
  if (!dataStore.trash.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
  }

  // check quiz name doesn't already exist in current user's list
  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner === tokenUser.userId && quiz.name === dataStore.quizzes[index].name ))) {
    throw new ApiError('Quiz name already exists', HttpStatusCode.BAD_REQUEST);
  }

  // check valid quizId is owned by the current user associated with token
  const tokenUser = findTokenUser(sessionId);
  if (dataStore.trash.some((quiz) => (quiz.quizOwner !== tokenUser.userId && quiz.quizId === quizId))) {
    throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.FORBIDDEN);
  }

//restores specified quiz from trash
  const restoreQuiz = dataStore.quizzes.splice(index, 1)[0];
  dataStore.trash.push(restoreQuiz);

//Update time quiz lasted edited
  const date = getUnixTime(new Date());
  dataStore.quizzes[index].timeLastEdited = date;

  setData(dataStore);
  return {};
}

export { adminQuizRemove, adminQuizViewTrash, adminQuizRestoreTrash };
