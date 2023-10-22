import { helperAdminRegister, createSessionId, tokenValidation } from './other';
import { getData, setData, Token } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';

interface AuthReturn {
  token: string
}

interface UserDetailReturn {
  user: {
    userId: number,
    name: string,
    email: string,
    numSuccessfulLogins: number,
    numFailedPasswordsSinceLastLogin: number
  }
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

/**
 * Given an admin user's authUserId, return details about the user.
 * "name" is the first and last name concatenated with a single space between them
 * @param {string} sessionId - calling user's Id
 * @returns {user: {userId: number, email: string,
 *              numSuccessfulLogins: number, numFailedPasswordsSinceLastLogin: number}}
 * @returns {{error: string}} on error
 */
function adminUserDetails(sessionId: string): UserDetailReturn {
  const dataStore = getData();
  // invalid Token
  if (!tokenValidation(sessionId)) {
    throw new ApiError('Token is invalid', HttpStatusCode.UNAUTHORISED);
  }

  const userIdInToken = dataStore.tokens.find(user => user.sessionId === sessionId);
  const adminUserDetails = dataStore.users.find(user => user.userId === userIdInToken.userId);

  return {
    user:
    {
      userId: adminUserDetails.userId,
      name: adminUserDetails.nameFirst + ' ' + adminUserDetails.nameLast,
      email: adminUserDetails.email,
      numSuccessfulLogins: adminUserDetails.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: adminUserDetails.numFailedPasswordsSinceLastLogin,
    }
  };
}

export { adminAuthRegister, adminAuthLogin, adminUserDetails };
