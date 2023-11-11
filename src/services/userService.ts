import { getData } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { findUTInfo, findUserById, hashText, setAndSave, tokenValidation } from './otherService';
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
 * @param {string} token - calling user's Id
 * @returns {user: {userId: number, email: string,
 *              numSuccessfulLogins: number, numFailedPasswordsSinceLastLogin: number}}
 * @returns {{error: string}} on error
 */
function adminUserDetails(token: string): UserDetailReturn {
  const dataStore = getData();
  // invalid Token
  if (!tokenValidation(token)) {
    throw new ApiError('Token is invalid', HttpStatusCode.UNAUTHORISED);
  }

  const userIdInToken = dataStore.utinfo.find(user => user.token === token);
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
 * Given a valid token and new details, update the token user's details.
 * @param {string} token - user's current token
 * @param {string} email - user's updated or current email
 * @param {string} nameFirst - user's updated or current first name
 * @param {string} nameLast - user's updated or current first name
 * @returns {{}} on successful update
 * @returns {{error: string}} on error
*/
function adminUserUpdateDetails(token: string, email: string, nameFirst: string, nameLast: string): object {
  const dataStore = getData();

  // check token is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // find user's details
  const userUTInfo = findUTInfo(token);
  const userId = userUTInfo.userId;
  const user = findUserById(userId);
  const currentUserEmail = user.email;

  // check new email is not currently used by another user (excluding current user)
  if (dataStore.users.some(user => user.email === email && user.email !== currentUserEmail)) {
    throw new ApiError('Email is currently used by another user', HttpStatusCode.BAD_REQUEST);
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

  // update user's details
  user.email = email;
  user.nameFirst = nameFirst;
  user.nameLast = nameLast;

  // save changes to dataStore
  setAndSave(dataStore);

  return {};
}

/**
 * Given details relating to a password change, update the password of a logged in user.
 * @param {string} token - current session id from UTInfo
 * @param {string} oldPassword - user's current password (before update)
 * @param {string} newPassword - new password to replace the current password
 * @returns {{}}
 * @returns {{ error: string }} on error
 */
function adminUserUpdatePassword(token: string, oldPassword: string, newPassword: string): object {
  const dataStore = getData();

  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  const hashedOldPW = hashText(oldPassword);
  const hashedNewPW = hashText(newPassword);

  // find user's details (list of old passwords)
  const userUTInfo = findUTInfo(token);
  const user = findUserById(userUTInfo.userId);

  // check oldPassword is correct
  if (hashedOldPW !== user.password) {
    throw new ApiError('Old Password is incorrect', HttpStatusCode.BAD_REQUEST);
  }

  // check newPassword matches oldPassword
  if (newPassword === oldPassword) {
    throw new ApiError('New Password cannot be the same as old password', HttpStatusCode.BAD_REQUEST);
  }

  // check newPassword hasn't been used by this user in the past
  if (user.oldPasswords.includes(hashedNewPW)) {
    throw new ApiError('New Password cannot be the same as old password', HttpStatusCode.BAD_REQUEST);
  }

  // check newPassword is not less than 8 characters
  if (newPassword.length < 8) {
    throw new ApiError('Password must be at least 8 characters', HttpStatusCode.BAD_REQUEST);
  }

  // check newPassword contains at least one number and at least one letter
  const pwLetterRegex = /[a-zA-Z]/;
  const pwNumRegex = /\d/;
  if (!pwLetterRegex.test(newPassword) || !pwNumRegex.test(newPassword)) {
    throw new ApiError('Password must contain at least one number and at least one letter', HttpStatusCode.BAD_REQUEST);
  }

  // store old password in user details
  user.oldPasswords.push(hashedOldPW);
  user.password = hashedNewPW;

  // update new password
  setAndSave(dataStore);
  return {};
}

export {
  adminUserDetails,
  adminUserUpdateDetails,
  adminUserUpdatePassword,
};
