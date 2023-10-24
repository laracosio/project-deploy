import { getData } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { tokenValidation } from './other';

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

export {
  adminUserDetails
};
