import { Answer, Quiz, getData } from '../dataStore';
import { getUnixTime } from 'date-fns';
import { findQuizById, findUTInfo, openSessionQuizzesState, setAndSave, tokenValidation, isImageUrlValid } from './otherService';
import { ApiError } from '../errors/ApiError';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import request from 'sync-request-curl';

interface QuestionInfoReturn {
  questionId: number,
  question: string,
  duration: number,
  thumbnailUrl?: string,
  points: number,
  answers: Answer[],
}

interface QuizInfoReturn {
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  numQuestions: number,
  questions: QuestionInfoReturn[],
  duration: number,
  thumbnailUrl?: string
}

interface QuizCreateReturn {
  quizId: number
}
interface BriefQuizInfo {
  quizId: number,
  name: string
}

interface QuizListReturn {
  quizzes: BriefQuizInfo[]
}

/**
 * Given basic details about a new quiz, create one for  the logged in user.
 * @param {string} token - unique token
 * @param {string} name - of quiz
 * @param {string} description - of quiz
 * @returns { quizId: number }
 * @returns { error: string }
*/
function adminQuizCreate(token: string, name: string, description: string): QuizCreateReturn {
  const dataStore = getData();

  // check that token is not empty or is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // check quiz name only contains alphanumeric characters and spaces
  if (!name.match(/^[a-zA-Z0-9\s]+$/)) {
    throw new ApiError('Invalid name, must not contain special characters', HttpStatusCode.BAD_REQUEST);
  }

  // check quiz name is between 3 and 30 characters long
  if (name.length < 3 || name.length > 30) {
    throw new ApiError('Invalid name length', HttpStatusCode.BAD_REQUEST);
  }

  const matchedToken = findUTInfo(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner === matchedToken.userId && q.name === name))) {
    throw new ApiError('Quiz name already in use', HttpStatusCode.BAD_REQUEST);
  }

  // check description is within 100 characters
  if (description.length > 100) {
    throw new ApiError('Description must be less than 100 characters', HttpStatusCode.BAD_REQUEST);
  }

  // find highest quizId from dataStore
  const newQuizId: number = (dataStore.maxQuizId + 1);
  dataStore.maxQuizId = newQuizId;

  const date = getUnixTime(new Date());

  const newQuiz: Quiz = {
    quizId: newQuizId,
    name: name,
    timeCreated: date,
    timeLastEdited: date,
    description: description,
    quizOwner: matchedToken.userId,
    numQuestions: 0,
    questions: [],
    quizDuration: 0,
  };

  dataStore.quizzes.push(newQuiz);
  setAndSave(dataStore);

  return {
    quizId: newQuizId
  };
}

/**
 * Get all of the relevant information about the current quiz.
 * @param {string} token
 * @param {number} quizId
 * @returns {quizId: number, name: string, timeCreated: number, timeLastEdited: number, description: string}
 */
function adminQuizInfo(token: string, quizId: number): QuizInfoReturn {
  const dataStore = getData();

  // check that token is not empty or is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // find user associated with token and checks whether they are the quiz owner
  const matchedToken = findUTInfo(token);

  if (dataStore.quizzes.some((q) => (q.quizOwner !== matchedToken.userId && q.quizId === quizId))) {
    throw new ApiError('User does not own quiz to check info', HttpStatusCode.FORBIDDEN);
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((q) => q.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
  }

  const quizMatch = dataStore.quizzes.find((q) => (q.quizOwner === matchedToken.userId && q.quizId === quizId));

  const filteredQuestionInfo: QuestionInfoReturn[] = quizMatch.questions.map(key => ({
    questionId: key.questionId,
    question: key.question,
    duration: key.duration,
    thumbnailUrl: key.thumbnailUrl,
    points: key.points,
    answers: key.answers
  }));

  const filteredQuizInfo: QuizInfoReturn = {
    quizId: quizMatch.quizId,
    name: quizMatch.name,
    timeCreated: quizMatch.timeCreated,
    timeLastEdited: quizMatch.timeLastEdited,
    description: quizMatch.description,
    numQuestions: quizMatch.numQuestions,
    questions: filteredQuestionInfo,
    duration: quizMatch.quizDuration,
  };

  if (quizMatch.thumbnailUrl) {
    filteredQuizInfo.thumbnailUrl = quizMatch.thumbnailUrl;
  }

  return filteredQuizInfo;
}

/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * @param {string} token
 * @returns {quizzes: [{quizId: number, name: string}]}
 * @returns {{error: string}}
 */
function adminQuizList (token: string): QuizListReturn {
  const dataStore = getData();

  // check that token is not empty or is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  const matchedToken = findUTInfo(token);

  // find all user quizzes and add to an array
  const userQuizList: Array<BriefQuizInfo> = [];
  dataStore.quizzes.forEach((quiz) => {
    if (quiz.quizOwner === matchedToken.userId) {
      const obj = {
        quizId: quiz.quizId,
        name: quiz.name,
      };
      userQuizList.push(obj);
    }
  });

  return {
    quizzes: userQuizList
  };
}

/**
 * Given a particular quiz, change the name of the quiz
 * @param {string} token
 * @param {number} quizId
 * @param {string} name
 * @returns {{error: string}}
 */
function adminQuizNameUpdate (token: string, quizId: number, name: string): object {
  const dataStore = getData();

  // check token is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // check valid quizId is owned by the current user associated with token
  const matchedToken = findUTInfo(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== matchedToken.userId && q.quizId === quizId))) {
    throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.FORBIDDEN);
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
  }

  // check quiz name only contains alphanumeric characters and spaces
  if (!name.match(/^[a-zA-Z0-9\s]+$/)) {
    throw new ApiError('Name cannot contain special characters', HttpStatusCode.BAD_REQUEST);
  }

  // check quiz name is between 3 and 30 characters long
  if (name.length < 3 || name.length > 30) {
    throw new ApiError('Invalid name length', HttpStatusCode.BAD_REQUEST);
  }
  // check quiz name doesn't already exist in current user's list
  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner === matchedToken.userId && quiz.name === name))) {
    throw new ApiError('Quiz name already exists', HttpStatusCode.BAD_REQUEST);
  }

  const index = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === matchedToken.userId && quiz.quizId === quizId));
  dataStore.quizzes[index].name = name;

  const date = getUnixTime(new Date());
  dataStore.quizzes[index].timeLastEdited = date;

  setAndSave(dataStore);
  return {};
}

/**
 * Given a particular quiz, change the description of the quiz
 * @param {string} token
 * @param {number} quizId
 * @param {string} description
 * @returns {{error: string}}
 */
function adminQuizDescriptionUpdate (token: string, quizId: number, description: string): object {
  const dataStore = getData();

  // check token is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // check valid quizId is owned by the current user associated with token
  const matchedToken = findUTInfo(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== matchedToken.userId && q.quizId === quizId))) {
    throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.FORBIDDEN);
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
  }

  // check description is within 100 characters
  if (description.length > 100) {
    throw new ApiError('Quiz Description more than 100 characters in length', HttpStatusCode.BAD_REQUEST);
  }

  const index = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === matchedToken.userId && quiz.quizId === quizId));
  dataStore.quizzes[index].description = description;

  const date = getUnixTime(new Date());
  dataStore.quizzes[index].timeLastEdited = date;

  setAndSave(dataStore);
  return {};
}

/**
 * Transfer ownership of a quiz to a different user based on their email
 * @param token - string of token
 * @param quizId - quizId to change ownership of
 * @param userEmail - email of user to change quiz to
 * @returns {}
 * @returns { error: string }
*/
function adminQuizTransferOwner(token: string, quizId: number, userEmail: string): object {
  const dataStore = getData();

  const transferUser = dataStore.users.find((user) => user.email === userEmail);
  const transferQuiz = findQuizById(quizId);

  const tokenUser = findUTInfo(token);
  // invalid token
  if (!tokenValidation(token)) {
    throw new ApiError('Token is invalid', HttpStatusCode.UNAUTHORISED);
  }

  // check quizId
  if (transferQuiz === undefined) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
  }

  // valid token but user is not owner
  if (tokenUser.userId !== transferQuiz.quizOwner) {
    throw new ApiError('User does not own quiz to change owner', HttpStatusCode.FORBIDDEN);
  }

  // check whether email is valid
  if (transferUser === undefined) {
    throw new ApiError('userEmail is not a real user', HttpStatusCode.BAD_REQUEST);
  }

  // check if tokenUser is the same as transferUser
  if (tokenUser.userId === transferUser.userId) {
    throw new ApiError('userEmail is the current logged in user', HttpStatusCode.BAD_REQUEST);
  }
  // duplicate name
  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner === transferUser.userId && quiz.name === transferQuiz.name))) {
    throw new ApiError('Quiz ID refers to a quiz that has a name that is already used by the target user', HttpStatusCode.BAD_REQUEST);
  }
  // open Session Quiz exists
  if (openSessionQuizzesState(quizId)) {
    throw new ApiError('All sessions for this quiz must be in END state', HttpStatusCode.BAD_REQUEST);
  }

  transferQuiz.quizOwner = transferUser.userId;
  transferQuiz.timeLastEdited = getUnixTime(new Date());
  setAndSave(dataStore);

  return {};
}

/**
 * Given a particular quiz, change the thumbnail of the quiz
 * @param {string} token
 * @param {number} quizId
 * @param {string} imgUrl
 * @returns {{error: string}}
 */
function quizThumbnailUpdate (token: string, quizId: number, imgUrl: string): object {
  const dataStore = getData();

  // check token is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // check valid quizId is owned by the current user associated with token
  const matchedToken = findUTInfo(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== matchedToken.userId && q.quizId === quizId))) {
    throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.FORBIDDEN);
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
  }

  // check imgUrl when fetched does not return a valid file
  if (imgUrl === '') {
    throw new ApiError('The thumbnailUrl is an empty string', HttpStatusCode.BAD_REQUEST);
  }
  const resThumbnail = request('GET', imgUrl);
  if (resThumbnail.statusCode !== 200) {
    throw new ApiError('The thumbnailUrl does not return to a valid type', HttpStatusCode.BAD_REQUEST);
  }

  // imgUrl when fetch is not a JPG or PNG image
  if (!isImageUrlValid(imgUrl)) {
    throw new ApiError('The thumbnailUrl, when fetched, is not a JPG or PNG file type', HttpStatusCode.BAD_REQUEST);
  }

  // find the quiz that quizId in parameters refers to
  const index = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === matchedToken.userId && quiz.quizId === quizId));
  dataStore.quizzes[index].thumbnailUrl = imgUrl;

  // Update timeLastEdited for the quiz
  const date = getUnixTime(new Date());
  dataStore.quizzes[index].timeLastEdited = date;

  setAndSave(dataStore);
  return {};
}

export {
  adminQuizInfo, adminQuizList, adminQuizCreate, adminQuizNameUpdate, adminQuizDescriptionUpdate,
  adminQuizTransferOwner, quizThumbnailUpdate
};
