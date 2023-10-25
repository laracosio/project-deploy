import { getData, setData } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { findToken, findUserById, tokenValidation } from './other';

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
 * Given an admin user's authUserId, return details about the user.
 * "name" is the first and last name concatenated with a single space between them
 * @param {string} sessionId - current session id from token
 * @param {string} oldPassword - user's current password (before update)
 * @param {string} newPassword - new password to replace the current password
 * @returns {{}}
 * @returns {{ error: string }} on error
 */
function adminUserUpdatePassword(token: string, oldPassword: string, newPassword: string): object {
  const dataStore = getData();

  if (tokenValidation(token)) {
    const userToken = findToken(token);
    const user = findUserById(userToken.userId);

    // check oldPassword is correct
    if (oldPassword !== user.password) {
      throw new ApiError('Old Password is incorrect', HttpStatusCode.BAD_REQUEST);
    }
  }

  // check newPassword doesn't match oldPassword
  if (newPassword === oldPassword) {
    throw new ApiError('New Password cannot be the same as old password', HttpStatusCode.BAD_REQUEST);
  }

  // check newPassword hasn't been used by this user in the past
  if (tokenValidation(token)) {
    const userToken = findToken(token);
    const user = findUserById(userToken.userId);

    if (user.oldPasswords.includes(newPassword)) {
      throw new ApiError('New Password cannot be the same as old password', HttpStatusCode.BAD_REQUEST);
    }
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

  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // store old password in user details
  const userToken = findToken(token);
  const user = findUserById(userToken.userId);

  user.oldPasswords.push(oldPassword);
  user.password = newPassword;

  // update new password
  setData(dataStore);
  return {};
}

export {
  adminUserDetails,
  adminUserUpdatePassword,
};
