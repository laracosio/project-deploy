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

function adminUserUpdateDetails(token: string, email: string, nameFirst: string, nameLast: string): object {
  const dataStore = getData();

  // check new email is not currently used by another user (excluding current user)
  console.log('bagel');
  // for (const user of dataStore.users) {
  //   if (user.email === email) {
  //     throw new ApiError('Email is currently used by another user', HttpStatusCode.BAD_REQUEST);
  //   }
  // }
  console.log('bagel1');
  // check email satisfies (validator.isEmail)
  if (!validator.isEmail(email)) {
    throw new ApiError('Invalid email', HttpStatusCode.BAD_REQUEST);
  }
  console.log('bagel2');
  // check names are between 2 and 20 characters
  if (nameFirst.length < 2 || nameLast.length < 2 ||
    nameFirst.length > 20 || nameLast.length > 20) {
      throw new ApiError('Name must be between 2 and 20 characters', HttpStatusCode.BAD_REQUEST);
  }
  console.log('bagel3');
  // check names contains only lowercase letters, uppercase letters, spaces, hyphens, or apostrophes
  const regex = /^[a-zA-Z\s\-']+$/;
  if (!regex.test(nameFirst) || !regex.test(nameLast)) {
    throw new ApiError('Name must only contain lowercase letters, uppercase letters, spaces, hyphens, or apostrophes', HttpStatusCode.BAD_REQUEST);
  }
  console.log('bagel4');
  // check token is valid
  if(!tokenValidation(token)) {
    console.log('poop');
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }
  console.log('bagel5');
  // find user and update their details
  const userToken = findToken(token);
  const userId = userToken.userId;
  const user = findUserById(userId);
  console.log('bagel6');
  user.email = email;
  user.nameFirst = nameFirst;
  user.nameLast = nameLast;

  console.log(user);

  // save changes to dataStore
  setData(dataStore);

  return {};
};

export {
  adminUserDetails,
  adminUserUpdateDetails
};
