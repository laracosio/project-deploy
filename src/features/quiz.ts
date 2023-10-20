import { getData, setData } from '../dataStore';
import { getUnixTime } from 'date-fns';
import { findTokenUser, tokenValidation } from './other';
import { ApiError } from '../errors/ApiError';
import { HttpStatusCode } from '../enums/HttpStatusCode';

interface QuizInfoReturn {
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string
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
 * Get all of the relevant information about the current quiz.
 * @param {string} token
 * @param {number} quizId
 * @returns {quizId: number, name: string, timeCreated: number, timeLastEdited: number, description: string}
 */
function adminQuizInfo(token:string, quizId: number): QuizInfoReturn {
  const dataStore = getData();

  // check that token is not empty or is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
    // return { error: 'Invalid token' };
  }

  // find user associated with token and checks whether they are the quiz owner
  const tokenUser = findTokenUser(token);

  if (dataStore.quizzes.some((q) => (q.quizOwner !== tokenUser.userId && q.quizId === quizId))) {
    throw new ApiError('User does not own quiz to check info', HttpStatusCode.FORBIDDEN);
    // return { error: 'User does not own quiz to check info' };
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((q) => q.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Invalid quiz ID' };
  }

  const quizMatch = dataStore.quizzes.find((q) => (q.quizOwner === tokenUser.userId && q.quizId === quizId));

  return {
    quizId: quizMatch.quizId,
    name: quizMatch.name,
    timeCreated: quizMatch.timeCreated,
    timeLastEdited: quizMatch.timeLastEdited,
    description: quizMatch.description,
  };
}

/**
 * Given basic details about a new quiz, create one for  the logged in user.
 * @param {string} token - unique token
 * @param {string} name - of quiz
 * @param {string} description - of quiz
 * @returns {quizId: 2}
 */
function adminQuizCreate(token: string, name: string, description: string): QuizCreateReturn {
  const dataStore = getData();

  // check that token is not empty or is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
    // return { error: 'Invalid token' };
  }

  // check quiz name only contains alphanumeric characters and spaces
  if (!name.match(/^[a-zA-Z0-9\s]+$/)) {
    throw new ApiError('Invalid name, must not contain special characters', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Invalid name, must not contain special characters' };
  }

  // check quiz name is between 3 and 30 characters long
  if (name.length < 3 || name.length > 30) {
    throw new ApiError('Invalid name length', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Invalid name length' };
  }

  const tokenUser = findTokenUser(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner === tokenUser.userId && q.name === name))) {
    throw new ApiError('Quiz name already in use', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Quiz name already in use' };
  }

  // check description is within 100 characters
  if (description.length > 100) {
    throw new ApiError('Description must be less than 100 characters', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Description must be less than 100 characters' };
  }

  let newQuizId;
  if (dataStore.quizzes.length === 0) {
    newQuizId = 1;
  } else {
    const reversedQuizIds = dataStore.quizzes.map(q => q.quizId).reverse();
    const currLastQuizId = reversedQuizIds[0];
    newQuizId = currLastQuizId + 1;
  }

  const date = getUnixTime(new Date());

  const newQuiz = {
    quizId: newQuizId,
    name: name,
    timeCreated: date,
    timeLastEdited: date,
    description: description,
    quizOwner: tokenUser.userId,
  };

  dataStore.quizzes.push(newQuiz);
  setData(dataStore);

  return {
    quizId: newQuizId
  };
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
    // return { error: 'Invalid token' };
  }

  const tokenUser = findTokenUser(token);

  // find all user quizzes and add to an array
  const userQuizList: Array<BriefQuizInfo> = [];
  dataStore.quizzes.forEach((quiz) => {
    if (quiz.quizOwner === tokenUser.userId) {
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
    // return { error: 'Invalid token' };
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Invalid quiz ID' };
  }

  // check valid quizId is owned by the current user associated with token
  const tokenUser = findTokenUser(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== tokenUser.userId && q.quizId === quizId))) {
    throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.UNAUTHORISED);
    // return { error: 'Quiz ID not owned by this user' };
  }

  // check quiz name only contains alphanumeric characters and spaces
  if (!name.match(/^[a-zA-Z0-9\s]+$/)) {
    throw new ApiError('Name cannot contain special characters', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Name cannot contain special characters' };
  }

  // check quiz name is between 3 and 30 characters long
  if (name.length < 3 || name.length > 30) {
    throw new ApiError('Invalid name length', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Invalid name length' };
  }
  // check quiz name doesn't already exist in current user's list
  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner === tokenUser.userId && quiz.name === name))) {
    throw new ApiError('Quiz name already exists', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Quiz name already exists' };
  }

  const index = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === tokenUser.userId && quiz.quizId === quizId));
  dataStore.quizzes[index].name = name;

  const date = getUnixTime(new Date());
  dataStore.quizzes[index].timeLastEdited = date;

  setData(dataStore);
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
    // return { error: 'Invalid token' };
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Invalid quiz ID' };
  }

  // check valid quizId is owned by the current user associated with token
  const tokenUser = findTokenUser(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== tokenUser.userId && q.quizId === quizId))) {
    throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.UNAUTHORISED);
    // return { error: 'Quiz ID not owned by this user' };
  }

  // check description is within 100 characters
  if (description.length > 100) {
    throw new ApiError('Quiz Description more than 100 characters in length', HttpStatusCode.FORBIDDEN);
    // return { error: 'Quiz Description more than 100 characters in length' };
  }

  const index = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === tokenUser.userId && quiz.quizId === quizId));
  dataStore.quizzes[index].description = description;

  const date = getUnixTime(new Date());
  dataStore.quizzes[index].timeLastEdited = date;

  setData(dataStore);
  return {};
}

export { adminQuizInfo, adminQuizList, adminQuizCreate, adminQuizNameUpdate, adminQuizDescriptionUpdate };
