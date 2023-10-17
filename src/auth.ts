import { helperAdminRegister, createSessionId } from './other';
import { getData, setData, ErrorObject, Token } from './dataStore';

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
function adminAuthRegister(email:string, password: string, nameFirst: string, nameLast:string): AuthReturn | ErrorObject {
  const dataStore = getData();
  if (!helperAdminRegister(email, password, nameFirst, nameLast, dataStore.users)) {
    return { error: 'Invalid registration details.' };
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
function adminAuthLogin(email:string, password: string): AuthReturn | ErrorObject {
  const dataStore = getData();

  const authUser = dataStore.users.find(user => user.email === email);
  // email does not belong to a user
  if (!authUser) {
    return { error: 'email does not belong to a user' };
  }

  // if password is incorrect
  if (authUser.password !== password) {
    authUser.numFailedPasswordsSinceLastLogin++;
    return { error: 'password is incorrect' };
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
 * @param {number} authUserId - calling user's Id
 * @returns {user: {userId: number, email: string,
 *              numSuccessfulLogins: number, numFailedPasswordsSinceLastLogin: number}}
 * @returns {{error: string}} on error
 */
function adminUserDetails(authUserId: number): UserDetailReturn | ErrorObject {
  const dataStore = getData();

  const authUser = dataStore.users.find(user => user.userId === authUserId);

  // invalid authUser
  if (!authUser) {
    return { error: 'authUserId does not belong to a user' };
  }

  return {
    user:
    {
      userId: authUser.userId,
      name: authUser.nameFirst + ' ' + authUser.nameLast,
      email: authUser.email,
      numSuccessfulLogins: authUser.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: authUser.numFailedPasswordsSinceLastLogin,
    }
  };
}

export { adminAuthRegister, adminAuthLogin, adminUserDetails };
