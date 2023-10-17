import { getData, setData, ErrorObject } from './dataStore';
import { getUnixTime } from 'date-fns';

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
 * @param {string} token
 * @param {number} quizId
 * @returns {quizId: number, name: string, timeCreated: number, timeLastEdited: number, description: string}
 */
function adminQuizInfo(token:string, quizId: number): QuizInfoReturn | ErrorObject {
  const dataStore = getData();

  // check that token is not empty or is valid
  if (!token || !dataStore.tokens.some(t => t.sessionId === token)) {
    return { error: 'Invalid token' };
  }

  // find user associated with token and checks whether they are the quiz owner
  const tokenUser = dataStore.tokens.find(t => t.sessionId === token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== tokenUser.userId && q.quizId === quizId))) {
    return { error: 'User does not own quiz to check info' };
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((q) => q.quizId === quizId)) {
    return { error: 'Invalid quiz ID' };
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
 *
 * @param {string} token - unique token
 * @param {string} name - of quiz
 * @param {string} description - of quiz
 * @returns {quizId: 2}
 */
function adminQuizCreate(token: string, name: string, description: string): QuizCreateReturn | ErrorObject {
  const dataStore = getData();

  // check that token is not empty or is valid
  if (!token || !dataStore.tokens.some(t => t.sessionId === token)) {
    return { error: 'Invalid token' };
  }

  // check quiz name only contains alphanumeric characters and spaces
  if (!name.match(/^[a-zA-Z0-9\s]+$/)) {
    return { error: 'Invalid name, must not contain special characters' };
  }

  // check quiz name is between 3 and 30 characters long
  if (name.length < 3 || name.length > 30) {
    return { error: 'Invalid name length' };
  }

  const tokenUser = dataStore.tokens.find(t => t.sessionId === token);
  if (dataStore.quizzes.some((q) => (q.quizOwner === tokenUser.userId && q.name === name))) {
    return { error: 'Quiz name already in use' };
  }

  // check description is within 100 characters
  if (description.length > 100) {
    return { error: 'Description must be less than 100 characters' };
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
 * Given a particular quiz, permanently remove the quiz.
 *
 * @param {string} token - unique token containing sessionId
 * @param {number} quizId - unique identifier for quiz
 * @returns {{error: string}}
 */
function adminQuizRemove(token:string, quizId: number): object | ErrorObject {
  const dataStore = getData();

  // check that quizId is not empty or is valid
  if (!quizId || !dataStore.quizzes.some(q => q.quizId === quizId)) {
    return { error: 'Invalid quizId' };
  }

  // check that token is not empty or is valid
  if (!token || !dataStore.tokens.some(t => t.sessionId === token)) {
    return { error: 'Invalid token' };
  }

  // find user associated with token and checks whether they are the quiz owner
  const tokenUser = dataStore.tokens.find(t => t.sessionId === token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== tokenUser.userId && q.quizId === quizId))) {
    return { error: 'User does not own quiz to remove' };
  }

  const quizIndex: number = dataStore.quizzes.findIndex(quiz => quiz.quizId === quizId);
  const trashQuiz = dataStore.quizzes.splice(quizIndex, 1)[0];
  trashQuiz.timeLastEdited = getUnixTime(new Date());
  dataStore.trash.push(trashQuiz);

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
function adminQuizList (authUserId: number): QuizListReturn | ErrorObject {
  const dataStore = getData();

  // check authUserId is valid
  if (!dataStore.users.some(user => user.userId === authUserId)) {
    return { error: 'Invalid user' };
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
function adminQuizNameUpdate (authUserId: number, quizId: number, name: string): object | ErrorObject {
  const dataStore = getData();

  // check authUserId is valid
  if (!dataStore.users.some(user => user.userId === authUserId)) {
    return { error: 'Invalid user ID' };
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    return { error: 'Invalid quiz ID' };
  }

  // check valid quizId is owned by the current user
  if (dataStore.quizzes.some((quiz) => (!(quiz.quizOwner === authUserId) && quiz.quizId === quizId))) {
    return { error: 'Quiz ID not owned by this user' };
  }

  // check quiz name only contains alphanumeric characters and spaces
  if (!name.match(/^[a-zA-Z0-9\s]+$/)) {
    return { error: 'Name cannot contain special characters' };
  }

  // check quiz name is between 3 and 30 characters long
  if (name.length < 3 || name.length > 30) {
    return { error: 'Invalid name length' };
  }
  // check quiz name doesn't already exist in current user's list
  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner === authUserId && quiz.name === name))) {
    return { error: 'Quiz name already exists' };
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

function adminQuizDescriptionUpdate (authUserId: number, quizId: number, description: string): object | ErrorObject {
  const dataStore = getData();

  // check authUserId is valid
  if (!dataStore.users.some(user => user.userId === authUserId)) {
    return { error: 'Invalid user ID' };
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    return { error: 'Invalid quiz ID' };
  }

  // check valid quizId is owned by the current user
  if (dataStore.quizzes.some((quiz) => (!(quiz.quizOwner === authUserId) && quiz.quizId === quizId))) {
    return { error: 'Quiz ID not owned by this user' };
  }

  // check description is within 100 characters
  if (description.length > 100) {
    return { error: 'Quiz Description more than 100 characters in length' };
  }

  const index = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === authUserId && quiz.quizId === quizId));
  dataStore.quizzes[index].description = description;

  const date = getUnixTime(new Date());
  dataStore.quizzes[index].timeLastEdited = date;

  setData(dataStore);
  return {};
}

export { adminQuizInfo, adminQuizList, adminQuizCreate, adminQuizRemove, adminQuizNameUpdate, adminQuizDescriptionUpdate };
