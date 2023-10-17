import { getData, setData, User, Token, AuthReturn } from './dataStore';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';

const MAXCHAR = 20;
const MINCHAR = 2;
const MINPWLEN = 8;

/**
 * Reset the state of the application back to the start.
 * @param {void}
 * @returns {void}
 */
function clear(): object {
  const store = getData();
  store.users = [];
  store.quizzes = [];
  setData(store);
  return {};
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
  while (tokens.some(t => t.sessionId === newSessionId)) {
    newSessionId = uuidv4();
  }
  return newSessionId;
}

/**
 * Helper function to validate token
 * @param {AuthToken} authtoken - unique token
 * @returns {boolean} - true if valid, false if invalid
 */
function tokenValidation (authToken: AuthReturn): boolean {
  const dataStore = getData();
  
  if(authToken.token === null) {
    return false;
  }

  const validToken = dataStore.tokens.find(token => token.sessionId === authToken.token);
  
  if(!validToken) {
    return false;
  }
  
  return true;
}

export { clear, helperAdminRegister, createSessionId, tokenValidation };
