import { helperAdminRegister, createSessionId } from './other';
import { getData, setData, Token } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';

interface AuthReturn {
  token: string
}

/**
 * Register a user with an email, password, and names, then returns their authUserId value.
 * @param {string} email - unique email address
 * @param {string} password - password of user's choice
 * @param {string} nameFirst - user's first name
 * @param {string} nameLast - user's last name
 * @returns {{authUserId: number}}
 * @returns {{error: string}} on error
 */
function adminAuthRegister(email:string, password: string, nameFirst: string, nameLast:string): AuthReturn {
  const dataStore = getData();

  if (!helperAdminRegister(email, password, nameFirst, nameLast, dataStore.users)) {
    throw new ApiError('Invalid registration details', HttpStatusCode.BAD_REQUEST);
  }

  const newUserId = dataStore.users.length + 1;
  const newUser = {
    userId: newUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: password,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
  };

  const newSessionId: string = createSessionId(dataStore.tokens);
  const newToken: Token = {
    sessionId: newSessionId,
    userId: newUserId
  };

  dataStore.users.push(newUser);
  dataStore.tokens.push(newToken);
  setData(dataStore);
  return { token: newSessionId };
}

/**
 * Given a registered user's email and password returns their authUserId value.
 * @param {number} email - unique email address
 * @param {number} password - user's password
 * @returns {{authUserId: number}} on successful log in
 * @returns {{error: string}} on error
*/
function adminAuthLogin(email:string, password: string): AuthReturn {
  const dataStore = getData();

  const authUser = dataStore.users.find(user => user.email === email);

  // email does not belong to a user
  if (!authUser) {
    throw new ApiError('email does not belong to a user', HttpStatusCode.BAD_REQUEST);
  }

  // if password is incorrect
  if (authUser.password !== password) {
    authUser.numFailedPasswordsSinceLastLogin++;
    throw new ApiError('password is incorrect', HttpStatusCode.BAD_REQUEST);
  }

  const authUserId = authUser.userId;
  // if successful login, reset num of failed password
  authUser.numSuccessfulLogins++;
  authUser.numFailedPasswordsSinceLastLogin = 0;

  const newSessionId: string = createSessionId(dataStore.tokens);
  const newToken: Token = {
    sessionId: newSessionId,
    userId: authUserId
  };
  dataStore.tokens.push(newToken);

  setData(dataStore);
  return { token: newSessionId };
}

function adminAuthLogout(token: string): object {
  const dataStore = getData();
  
  console.log('hello');
  // check if token is valid
  if (!dataStore.tokens.some(user =>user.sessionId === token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // remove token from dataStore
  const tokenIndex: number = dataStore.tokens.findIndex(user => user.sessionId === token);
  dataStore.tokens.splice(tokenIndex, 1);

  setData(dataStore);

  return {};
}

export {
  adminAuthRegister, adminAuthLogin, adminAuthLogout
};
