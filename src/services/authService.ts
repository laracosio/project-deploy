import { helperAdminRegister, createToken, setAndSave, hashText } from './otherService';
import { getData, UTInfo } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
interface AuthReturn {
  token: string
}

/**
 * Register a new admin User
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
  const hashedPassword = hashText(password);
  const oldPasswords: string[] = [];
  const newUser = {
    userId: newUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    password: hashedPassword,
    oldPasswords: oldPasswords,
    email: email,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
  };

  const newToken: string = createToken(dataStore.utinfo);
  const newUTInfo: UTInfo = {
    token: newToken,
    userId: newUserId
  };
  dataStore.users.push(newUser);
  dataStore.utinfo.push(newUTInfo);

  setAndSave(dataStore);

  return { token: newToken };
}

/**
 * Logs in an admin user
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
  if (authUser.password !== hashText(password)) {
    authUser.numFailedPasswordsSinceLastLogin++;
    throw new ApiError('password is incorrect', HttpStatusCode.BAD_REQUEST);
  }

  const authUserId = authUser.userId;
  // if successful login, reset num of failed password
  authUser.numSuccessfulLogins++;
  authUser.numFailedPasswordsSinceLastLogin = 0;

  const newToken: string = createToken(dataStore.utinfo);
  const newUTInfo: UTInfo = {
    token: newToken,
    userId: authUserId
  };
  dataStore.utinfo.push(newUTInfo);

  setAndSave(dataStore);

  return { token: newToken };
}

/**
 * Logs out an admin user with an active session
 * @param token - token identifying user
 * @returns {}
 * @returns { error: string}
 */
function adminAuthLogout(token: string): object {
  const dataStore = getData();

  // check if token is valid
  if (!dataStore.utinfo.some(user => user.token === token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // remove token from dataStore
  const tokenIndex: number = dataStore.utinfo.findIndex(user => user.token === token);
  dataStore.utinfo.splice(tokenIndex, 1);

  setAndSave(dataStore);

  return {};
}

export {
  adminAuthRegister, adminAuthLogin, adminAuthLogout
};
