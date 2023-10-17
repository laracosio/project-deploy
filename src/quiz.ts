import { getData, setData, ErrorObject } from './dataStore';
import { getUnixTime } from 'date-fns';
import { ApiError } from './errors/ApiError';
import { HttpStatusCode } from './enums/HttpStatusCode';

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
 *
 * @param {number} authUserId
 * @param {number} quizId
 * @returns {quizId: number, name: string, timeCreated: number, timeLastEdited: number, description: string}
 */

function adminQuizInfo (authUserId: number, quizId: number): QuizInfoReturn {
  const dataStore = getData();
  // check authUserId is valid
  if (!dataStore.users.some(user => user.userId === authUserId)) {
    throw new ApiError('Invalid user', HttpStatusCode.FORBIDDEN);
    // return { error: 'Invalid user' };
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Invalid quiz ID' };
  }

  // check valid quizId is owned by the current user
  if (dataStore.quizzes.some((quiz) => (!(quiz.quizOwner === authUserId) && quiz.quizId === quizId))) {
    throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.FORBIDDEN);
    // return { error: 'Quiz ID not owned by this user' };
  }

  const quizMatch = dataStore.quizzes.find((quiz) => (quiz.quizOwner === authUserId && quiz.quizId === quizId));

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
 *
 * @param {number} authUserId - unique identifier for authorised user
 * @param {string} name - of quiz
 * @param {string} description - of quiz
 * @returns {quizId: 2}
 */
function adminQuizCreate(authUserId: number, name: string, description: string): QuizCreateReturn {
  const dataStore = getData();

  // check authUserId is valid
  if (!dataStore.users.some(user => user.userId === authUserId)) {
    throw new ApiError('Invalid user', HttpStatusCode.UNAUTHORISED);
    // return { error: 'Invalid user' };
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
  // check quiz name doesn't already exist in current user's list
  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner === authUserId && quiz.name === name))) {
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
    quizOwner: authUserId,
  };

  dataStore.quizzes.push(newQuiz);
  setData(dataStore);

  return {
    quizId: newQuizId,
  };
}

/**
 * Given a particular quiz, permanently remove the quiz.
 *
 * @param {Number} authUserId - unique identifier for user
 * @param {number} quizId - unique identifier for quiz
 * @returns {{error: string}}
 */
function adminQuizRemove(authUserId: number, quizId: number): object {
  const dataStore = getData();

  if (!dataStore.users.some(user => user.userId === authUserId)) {
    throw new ApiError('Invalid userId', HttpStatusCode.UNAUTHORISED);
    // return { error: 'Invalid userId' };
  }
  if (!dataStore.quizzes.some(quiz => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quizId', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Invalid quizId' };
  }
  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner !== authUserId && quiz.quizId === quizId))) {
    throw new ApiError('User does not own quiz to remove', HttpStatusCode.UNAUTHORISED);
    // return { error: 'User does not own quiz to remove' };
  }

  dataStore.quizzes.splice(dataStore.quizzes.findIndex(quiz => quiz.quizId === quizId), 1);

  setData(dataStore);
  return {};
}

/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {number} authUserId
 * @returns {quizzes: [{quizId: number, name: string}]}
 * @returns {{error: string}}
 *
 */
function adminQuizList (authUserId: number): QuizListReturn {
  const dataStore = getData();

  // check authUserId is valid
  if (!dataStore.users.some(user => user.userId === authUserId)) {
    throw new ApiError('Invalid user', HttpStatusCode.UNAUTHORISED);
    // return { error: 'Invalid user' };
  }

  // find all user quizzes and add to an array
  const userQuizList: Array<BriefQuizInfo> = [];
  dataStore.quizzes.forEach((quiz) => {
    if (quiz.quizOwner === authUserId) {
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
 *
 * @param {number} authUserId
 * @param {number} quizId
 * @param {string} name
 * @returns {{error: string}}
 *
 */
function adminQuizNameUpdate (authUserId: number, quizId: number, name: string): object {
  const dataStore = getData();

  // check authUserId is valid
  if (!dataStore.users.some(user => user.userId === authUserId)) {
    throw new ApiError('Invalid user ID', HttpStatusCode.UNAUTHORISED);
    // return { error: 'Invalid user ID' };
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Invalid quiz ID' };
  }

  // check valid quizId is owned by the current user
  if (dataStore.quizzes.some((quiz) => (!(quiz.quizOwner === authUserId) && quiz.quizId === quizId))) {
    throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.FORBIDDEN);
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
  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner === authUserId && quiz.name === name))) {
    throw new ApiError('Quiz name already exists', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Quiz name already exists' };
  }

  const index = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === authUserId && quiz.quizId === quizId));
  dataStore.quizzes[index].name = name;

  const date = getUnixTime(new Date());
  dataStore.quizzes[index].timeLastEdited = date;

  setData(dataStore);
  return {};
}

// Stub function for adminQuizDescriptionUpdate - Josh
/**
 * Given a particular quiz, change the description of the quiz
 *
 * @param {number} authUserId
 * @param {number} quizId
 * @param {string} description
 * @returns {{error: string}}
 *
 */

function adminQuizDescriptionUpdate (authUserId: number, quizId: number, description: string): object {
  const dataStore = getData();

  // check authUserId is valid
  if (!dataStore.users.some(user => user.userId === authUserId)) {
    throw new ApiError('Invalid user ID', HttpStatusCode.UNAUTHORISED);
    // return { error: 'Invalid user ID' };
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
    // return { error: 'Invalid quiz ID' };
  }

  // check valid quizId is owned by the current user
  if (dataStore.quizzes.some((quiz) => (!(quiz.quizOwner === authUserId) && quiz.quizId === quizId))) {
    throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.FORBIDDEN);
    // return { error: 'Quiz ID not owned by this user' };
  }

  // check description is within 100 characters
  if (description.length > 100) {
    throw new ApiError('Quiz Description more than 100 characters in length', HttpStatusCode.FORBIDDEN);
    // return { error: 'Quiz Description more than 100 characters in length' };
  }

  const index = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === authUserId && quiz.quizId === quizId));
  dataStore.quizzes[index].description = description;

  const date = getUnixTime(new Date());
  dataStore.quizzes[index].timeLastEdited = date;

  setData(dataStore);
  return {};
}

export { adminQuizInfo, adminQuizList, adminQuizCreate, adminQuizRemove, adminQuizNameUpdate, adminQuizDescriptionUpdate };
