import { helperAdminRegister, createSessionId, setAndSave } from './other';
import { getData, Token } from '../dataStore';
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
  const oldPasswords: string[] = [];
  const newUser = {
    userId: newUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    password: password,
    oldPasswords: oldPasswords,
    email: email,
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

  setAndSave(dataStore);

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

  setAndSave(dataStore);

  return { token: newSessionId };
}

export {
  adminAuthRegister, adminAuthLogin
};
