import { getData, setData, User, Token, Quiz, Question, Datastore } from '../dataStore';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import crypto from 'crypto';
import { SessionStates } from '../enums/SessionStates';

const MAXCHAR = 20;
const MINCHAR = 2;
const MINPWLEN = 8;

/**
 * Reset the state of the application back to the start.
 * @param {void}
 * @returns {void}
 */
function clear(): object {
  const dataStore = getData();
  dataStore.users = [];
  dataStore.quizzes = [];
  dataStore.tokens = [];
  dataStore.trash = [];
  dataStore.sessions = [];
  dataStore.maxQuizId = 0;
  dataStore.maxPlayerId = 0;
  setAndSave(dataStore);
  return {};
}

/**
 * Function which sets data to the DataStore and saves changes to
 * datastore.json as JSONified string
 * @param dataStore = stores user, quiz, tokens and trash information
 */
export function setAndSave(dataStore: Datastore) {
  setData(dataStore);
  fs.writeFileSync('datastore.json', JSON.stringify(dataStore));
}

/**
 * Helper function to validate user data for registration.
 * @param {string} email - unique email address
 * @param {string} password - password of user's choice
 * @param {string} nameFirst - user's first name
 * @param {string} nameLast - user's last name
 * @returns {boolean} - true if valid, false if invalid
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
 */
function helperAdminRegister(email: string, password: string, nameFirst: string, nameLast: string, userArray: User[]): boolean {
  // check valid email
  if (!validator.isEmail(email)) {
    return false;
  }
  // check if duplicate
  for (const user of userArray) {
    if (user.email === email) {
      return false;
    }
  }
  // check if names are within limit
  if (nameFirst.length < MINCHAR || nameLast.length < MINCHAR ||
      nameFirst.length > MAXCHAR || nameLast.length > MAXCHAR) {
    return false;
  }
  // check if names only contain letters, spaces, hypens or apostrophes
  const regex = /^[a-zA-Z\s\-']+$/;
  if (!regex.test(nameFirst) || !regex.test(nameLast)) {
    return false;
  }
  // check if password is long enough
  if (password.length < MINPWLEN) {
    return false;
  }
  // check that password has 1 letter and 1 number
  const pwLetterRegex = /[a-zA-Z]/;
  const pwNumRegex = /\d/;
  if (!pwLetterRegex.test(password) || !pwNumRegex.test(password)) {
    return false;
  }
  return true;
}

/**
 * Generates a sessionId and checks that sessionId has not been assigned previously
 * @param {Array<Tokens>} Token Datastore to check that generated sID does not already exist
 * @returns {string} sessionId
 */
function createSessionId(tokens: Array<Token>): string {
  let newSessionId: string = uuidv4();
  /* istanbul ignore next */
  while (tokens.some(t => t.sessionId === newSessionId)) {
    newSessionId = uuidv4();
  }
  return newSessionId;
}

/**
 * Helper function to validate token
 * @param {string} token - unique token
 * @returns {boolean} - true if valid, false if invalid
 */
function tokenValidation (token: string): boolean {
  const dataStore = getData();
  if (token === null) {
    return false;
  }
  // check whether token exists in dataStore
  if (!dataStore.tokens.some(t => t.sessionId === token)) {
    return false;
  }
  return true;
}

/**
 * Returns a Token from the dataStore based on passed in sessionId
 * @param token - sessionId
 * @returns Token | undefined (if not found)
 */
function findToken (token: string): Token {
  const dataStore = getData();
  return dataStore.tokens.find(t => t.sessionId === token);
}

/**
 * Returns a user from the dataStore based on passed in userId
 * @param userId - identifies user based on userId
 * @returns User | undefined(if not found)
 */
function findUserById (userId: number): User {
  const dataStore = getData();
  return dataStore.users.find((user) => user.userId === userId);
}

/**
 * Returns a user from the dataStore based on passed in quizId
 * @param quizId - identifies user based on quizId
 * @returns Quiz | undefined(if not found)
 */
function findQuizById (quizId: number): Quiz {
  const dataStore = getData();
  return dataStore.quizzes.find((quiz) => quiz.quizId === quizId);
}

/**
 * Returns a Question within a Quiz based on Quiz and questionId
 * @param quiz - takes in a Quiz NOT quizId
 * @param questionId - identifies individual question witihin Quiz
 * @returns Question | undefined(if not found)
 */
function findQuestionByQuiz (quiz: Quiz, questionId: number): Question {
  return quiz.questions.find((question) => question.questionId === questionId);
}

function getTotalDurationOfQuiz (quizId: number): number {
  const dataStore = getData();
  let totalDuration = 0;

  const quiz = dataStore.quizzes.find(quiz => quiz.quizId === quizId);

  for (const question of quiz.questions) {
    totalDuration = totalDuration + question.duration;
  }
  return totalDuration;
}

function getRandomColorAndRemove(availableColours: string[]): string | null {
  if (availableColours.length === 0) {
    // Array is empty, return null or handle as desired
    return null;
  }
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * availableColours.length);

  // Get the random color
  const randomColor = availableColours[randomIndex];

  // Remove the color from the array
  availableColours.splice(randomIndex, 1);

  return randomColor;
}

/**
 * Returns a quiz from the dataStore based on passed in quizId
 * @param quizId - identifies quiz based on quizId
 * @returns Quiz | undefined(if not found)
 */
function findTrashedQuizById (quizId: number): Quiz {
  const dataStore = getData();
  return dataStore.trash.find((quiz) => quiz.quizId === quizId);
}

/**
 * sha256 Hash a string
 * @param text - input text
 * @returns string
 */
function hashText(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Check whether sessions of with this quizId are in end state
 * Returns true if not all quizzes are ended.
 * @param quizId - quizId to find all sessions using this quiz
 * @returns boolean
 */
function openSessionQuizzesState(quizId: number): boolean {
  const dataStore = getData();
  return dataStore.sessions.some(element => element.sessionQuiz.quizId === quizId &&
    element.sessionState !== SessionStates.END);
}

/**
 *
 * @param thumbnailUrl
 * @returns boolean
 */
function isImageUrlValid(thumbnailUrl: string): boolean {
  const imageRegex = /\.(png|jpg|jpeg)$/i;

  return imageRegex.test(thumbnailUrl);
}
export {
  clear, helperAdminRegister, createSessionId, tokenValidation,
  findQuestionByQuiz, findQuizById, findUserById, findToken,
  getTotalDurationOfQuiz, getRandomColorAndRemove, findTrashedQuizById,
  hashText, openSessionQuizzesState, isImageUrlValid
};
