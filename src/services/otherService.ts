import { getData, setData, User, UTInfo, Quiz, Question, Datastore, Session } from '../dataStore';
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
export function clear(): object {
  const dataStore = getData();
  dataStore.users = [];
  dataStore.quizzes = [];
  dataStore.mapUT = [];
  dataStore.trash = [];
  dataStore.sessions = [];
  dataStore.mapPS = [];
  dataStore.maxQuizId = 0;
  dataStore.maxPlayerId = 0;
  dataStore.maxSessionId = 0;
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
 * Helper export function to validate user data for registration.
 * @param {string} email - unique email address
 * @param {string} password - password of user's choice
 * @param {string} nameFirst - user's first name
 * @param {string} nameLast - user's last name
 * @returns {boolean} - true if valid, false if invalid
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
 */
export function helperAdminRegister(email: string, password: string, nameFirst: string, nameLast: string, userArray: User[]): boolean {
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
 * Generates a token and checks that token has not been assigned previously
 * @param {Array<UTInfo>} UTInfo Datastore to check that generated sID does not already exist
 * @returns {string} token
 */
export function createToken(tokens: Array<UTInfo>): string {
  let newToken: string = uuidv4();
  /* istanbul ignore next */
  while (tokens.some(t => t.token === newToken)) {
    newToken = uuidv4();
  }
  return newToken;
}

/**
 * Helper export function to validate token
 * @param {string} token - unique token
 * @returns {boolean} - true if valid, false if invalid
 */
export function tokenValidation (token: string): boolean {
  const dataStore = getData();
  if (token === null) {
    return false;
  }
  // check whether token exists in dataStore
  if (!dataStore.mapUT.some(t => t.token === token)) {
    return false;
  }
  return true;
}

/**
 * Returns a UTInfo from the dataStore based on passed in token
 * @param token - token
 * @returns Token | undefined (if not found)
 */
export function findUTInfo (token: string): UTInfo {
  const dataStore = getData();
  return dataStore.mapUT.find(t => t.token === token);
}

/**
 * Returns a user from the dataStore based on passed in userId
 * @param userId - identifies user based on userId
 * @returns User | undefined(if not found)
 */
export function findUserById (userId: number): User {
  const dataStore = getData();
  return dataStore.users.find((user) => user.userId === userId);
}

/**
 * Returns a user from the dataStore based on passed in quizId
 * @param quizId - identifies user based on quizId
 * @returns Quiz | undefined(if not found)
 */
export function findQuizById (quizId: number): Quiz {
  const dataStore = getData();
  return dataStore.quizzes.find((quiz) => quiz.quizId === quizId);
}

/**
 * Returns a Question within a Quiz based on Quiz and questionId
 * @param quiz - takes in a Quiz NOT quizId
 * @param questionId - identifies individual question witihin Quiz
 * @returns Question | undefined(if not found)
 */
export function findQuestionByQuiz (quiz: Quiz, questionId: number): Question {
  return quiz.questions.find((question) => question.questionId === questionId);
}

export function getTotalDurationOfQuiz (quizId: number): number {
  const dataStore = getData();
  let totalDuration = 0;

  const quiz = dataStore.quizzes.find(quiz => quiz.quizId === quizId);

  for (const question of quiz.questions) {
    totalDuration = totalDuration + question.duration;
  }
  return totalDuration;
}

export function getRandomColorAndRemove(availableColours: string[]): string | null {
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
export function findTrashedQuizById (quizId: number): Quiz {
  const dataStore = getData();
  return dataStore.trash.find((quiz) => quiz.quizId === quizId);
}

/**
 * sha256 Hash a string
 * @param text - input text
 * @returns string
 */
export function hashText(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Check whether sessions of with this quizId are in end state
 * Returns true if not all quizzes are ended.
 * @param quizId - quizId to find all sessions using this quiz
 * @returns boolean
 */
export function openSessionQuizzesState(quizId: number): boolean {
  const dataStore = getData();
  return dataStore.sessions.some(element => element.sessionQuiz.quizId === quizId &&
    element.sessionState !== SessionStates.END);
}

/**
 * Checks whether playerId exists in the playerSession index
 * @param playerId - integer representing the player
 * @returns boolean - true if found, false otherwise
 */
export function playerValidation(playerId: number): boolean {
  const dataStore = getData();
  if (!playerId) {
    return false;
  }
  // check whether token exists in dataStore
  if (!dataStore.mapPS.some(elem => elem.playerId === playerId)) {
    return false;
  }
  return true;
}

/**
 * Finds session that player is participating in
 * @param playerId - integer representing the player
 * @returns Session within dataStore where player is apart of
 */
export function findSessionByPlayerId(playerId: number): Session {
  const dataStore = getData();
  const matchedIndex = dataStore.mapPS.find(elem => elem.playerId === playerId);
  const matchedSessionId = matchedIndex.sessionId;
  return dataStore.sessions.find(session => session.sessionId === matchedSessionId);
}

/**
 * Finds and returns the name of the player.
 * @param playerId - playerId of player to be found
 * @param sessionId - sessionId player is in
 * @returns string of name of player
 */
export function findPlayerName(playerId: number, sessionId: number): string {
  const dataStore = getData();
  const matchedSession = dataStore.sessions.find(session => session.sessionId === sessionId);
  const matchedPlayer = matchedSession.sessionPlayers.find(player => player.playerId === playerId);
  return matchedPlayer.playerName;
}

/**
 * checks whether thumbnailUrl ends with png, jpg or jpeg
 * @param thumbnailUrl
 * @returns boolean
 */
export function isImageUrlValid(thumbnailUrl: string): boolean {
  const imageRegex = /\.(png|jpg|jpeg)$/i;

  return imageRegex.test(thumbnailUrl);
}

export function generateRandomString() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let randomLetters = '';
  let randomNumbers = '';

  // Generate 5 random letters
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    randomLetters += letters.charAt(randomIndex);
  }

  // Generate 3 random numbers
  for (let i = 0; i < 3; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    randomNumbers += randomNumber.toString();
  }

  const newName = randomLetters + randomNumbers;
  return newName;
}
