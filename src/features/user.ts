import { getData, setData } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { findToken, findUserById, tokenValidation } from './other';
import validator from 'validator';

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

/**
 * Given a valid sessionId and new details, update the sessionId user's details.
 * @param {string} token - user's current token/sessionId
 * @param {string} email - user's updated or current email
 * @param {string} nameFirst - user's updated or current first name
 * @param {string} nameLast - user's updated or current first name
 * @returns {{}} on successful update
 * @returns {{error: string}} on error
*/
function adminUserUpdateDetails(token: string, email: string, nameFirst: string, nameLast: string): object {
  const dataStore = getData();

  // if token is valid, find current user and check email
  // check new email is not currently used by another user (excluding current user)
  if (tokenValidation(token)) {
    const userToken = findToken(token);
    const userId = userToken.userId;
    const user = findUserById(userId);
    const currentUserEmail = user.email;
    if (dataStore.users.some(user => user.email === email && user.email !== currentUserEmail)) {
      throw new ApiError('Email is currently used by another user', HttpStatusCode.BAD_REQUEST);
    }
  }

  // check email satisfies (validator.isEmail)
  if (!validator.isEmail(email)) {
    throw new ApiError('Invalid email', HttpStatusCode.BAD_REQUEST);
  }

  // check names are between 2 and 20 characters
  if (nameFirst.length < 2 || nameLast.length < 2 ||
    nameFirst.length > 20 || nameLast.length > 20) {
    throw new ApiError('Name must be between 2 and 20 characters', HttpStatusCode.BAD_REQUEST);
  }

  // check names contains only lowercase letters, uppercase letters, spaces, hyphens, or apostrophes
  const regex = /^[a-zA-Z\s\-']+$/;
  if (!regex.test(nameFirst) || !regex.test(nameLast)) {
    throw new ApiError('Name must only contain lowercase letters, uppercase letters, spaces, hyphens, or apostrophes', HttpStatusCode.BAD_REQUEST);
  }

  // check token is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // find user and update their details
  const userToken = findToken(token);
  const userId = userToken.userId;
  const user = findUserById(userId);

  user.email = email;
  user.nameFirst = nameFirst;
  user.nameLast = nameLast;

  // save changes to dataStore
  setData(dataStore);

  return {};
}

export {
  adminUserDetails,
  adminUserUpdateDetails
};
