import { getData, setData, Quiz } from '../dataStore';
import { ApiError } from '../errors/ApiError';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { tokenValidation, findToken, findQuizById } from './other';
import { getUnixTime } from 'date-fns';

interface BriefTrashQuizInfo {
  quizId: number,
  name: string
}

interface userTrashQuizList {
  quizzes: BriefTrashQuizInfo[]
} 
interface quizzesArray {
  quizzes: Quiz[]
}

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
  const quizDeleted = quiz.questions.splice(questionIndex, 1)[0];

  quiz.timeLastEdited = getUnixTime(new Date());
  quiz.quizDuration = quiz.quizDuration - quizDeleted.duration;
  quiz.numQuestions--;
  setData(dataStore);

  return {};
}

/**
 * Provide a list of all quizzes in the trash that are owned by the currently logged in user.
 * @param {string} sessionId
 * @returns {quizzes: [{quizId: number, name: string}]}
 * @returns {{error: string}}
 */
function adminQuizViewTrash(sessionId: string): userTrashQuizList {
  const dataStore = getData();
  // check that token is not empty or is valid
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // find all user quizzes in the trash and add to an array
  const tokenUser = findToken(sessionId);
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
    quizzes: userTrashQuizList
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

  // check sessionId is valid
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // check quizId refers to quiz in trash'
  const matchedQuiz = dataStore.trash.find((quiz) => quiz.quizId === quizId);
  if (matchedQuiz === undefined) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
  }

  // check quiz name doesn't already exist in current user's lists
  const tokenUser = findToken(sessionId);

  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner === tokenUser.userId && quiz.name === matchedQuiz.name))) {
    throw new ApiError('Quiz name already exists', HttpStatusCode.BAD_REQUEST);
  }

  // check valid quizId is owned by the current user associated with token
  if (dataStore.trash.some((quiz) => (quiz.quizOwner !== tokenUser.userId && quiz.quizId === quizId))) {
    throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.FORBIDDEN);
  }

  // restores specified quiz from trash
  const index1 = dataStore.trash.findIndex((quiz) => (quiz.quizOwner === tokenUser.userId && quiz.quizId === quizId));
  const restoreQuiz = dataStore.trash.splice(index1, 1)[0];
  dataStore.quizzes.push(restoreQuiz);

  // Update time quiz lasted edited
  const index2 = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === tokenUser.userId && quiz.quizId === quizId));
  const date = getUnixTime(new Date());
  dataStore.quizzes[index2].timeLastEdited = date;

  setData(dataStore);
  return {};
}

/**
 * Given a string of quiz IDs, permanently empty/remove it from trash.
 * @param {string} sessionId
 * @param {number} quizIds
 * @returns {{error: string}}
 */
function adminQuizEmptyTrash (sessionId: string, quizIds: string): object {
  const dataStore = getData();
  
  // convert the string of quizIds into an array of numbers
  const numbersArray = quizIds.split(',').map(Number);

  const parsedArray: Array<number> = JSON.parse(quizIds);

//NEW CODE BLOCK
  // check sessionId is valid
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  const tokenUser = findToken(sessionId);
  // elements should be the individual quizIds of the parsed
  for (const element of parsedArray) {

    // check valid quizIds are owned by the current user associated with token
    if ((dataStore.trash.some(quiz => quiz.quizId === element && quiz.quizOwner !== tokenUser.userId)) || (dataStore.quizzes.some(quiz => quiz.quizId === element && quiz.quizOwner !== tokenUser.userId))) {
      throw new ApiError(
        'Valid token is provided, but one or more of the Quiz IDs refers to a quiz that this current user does not own', 
        HttpStatusCode.FORBIDDEN);
    }

    // parsed quizId does not appear in trash
    if (!dataStore.trash.some(quiz => quiz.quizId === element)) {
      throw new ApiError('One or more of the Quiz IDs is not currently in the trash', HttpStatusCode.BAD_REQUEST);
    }

    const matchedQuizIndex = dataStore.trash.findIndex((quiz) => quiz.quizId === element);
    dataStore.trash.splice(matchedQuizIndex, 0);
  }
  setAndSave(dataStore);
  return {};
}

  //END OF NEW CODE BLOCK 
  
  // // covert the array of numbers to an array of quizzes
  // numbersArray.forEach(numbersArray.find(quiz => ()))
 
 
 
  // for (let i = 0; i < numbersArray.length; i++) {
  //   // const tokenUser = findToken(sessionId);
  //   const quizIdsArray: Array<quizzesArray> = [];
  //   numbersArray.forEach((quiz) => {
  //     if (quiz.quizOwner === tokenUser.userId) {
  //       const obj = {
  //         quizId: quiz.quizId,
  //         name: quiz.name,
  //       };
  //       quizIdsArray.push(obj);
  //     }
  //   });
  // }

//   // check sessionId is valid
//   if (!tokenValidation(sessionId)) {
//     throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
//   }

//   // check valid quizIds are owned by the current user associated with token
//   if (dataStore.trash.some((quiz) => (quiz.quizOwner !== tokenUser.userId && quiz.quizId === quizId))) {
//     throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.FORBIDDEN);
//   }

// if (numbersArray.some((quizIds) => ((dataStore.quizzes.forEach((quiz) => (quiz.quizOwner)) !== tokenUser.userId && === quizIds) || ( !== tokenUser.userId && === quizIds))))  

//   // check quizId refers to quiz in trash'
//   const matchedQuiz = dataStore.trash.find((quiz) => quiz.quizId === quizId);
//   if (matchedQuiz === undefined) {
//     throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
//   }



//   setData(dataStore);
//   return {};
// }

export { adminQuizRemove, quizRemoveQuestion, adminQuizViewTrash, adminQuizRestoreTrash, adminQuizEmptyTrash };
