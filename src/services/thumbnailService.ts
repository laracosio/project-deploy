import { getData } from '../dataStore';
import { getUnixTime } from 'date-fns';
import { setAndSave, tokenValidation, isImageUrlValid, findUTInfo } from './otherService';
import { ApiError } from '../errors/ApiError';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import request from 'sync-request-curl';

/**
 * Given a particular quiz, change the thumbnail of the quiz
 * @param {string} token
 * @param {number} quizId
 * @param {string} imgUrl
 * @returns {{error: string}}
 */
function quizThumbnailUpdate (token: string, quizId: number, imgUrl: string): object {
  const dataStore = getData();

  // check token is valid
  if (!tokenValidation(token)) {
    throw new ApiError('Invalid token', HttpStatusCode.UNAUTHORISED);
  }

  // check valid quizId is owned by the current user associated with token
  const matchedToken = findUTInfo(token);
  if (dataStore.quizzes.some((q) => (q.quizOwner !== matchedToken.userId && q.quizId === quizId))) {
    throw new ApiError('Quiz ID not owned by this user', HttpStatusCode.FORBIDDEN);
  }

  // check quizId is valid
  if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
    throw new ApiError('Invalid quiz ID', HttpStatusCode.BAD_REQUEST);
  }

  // check imgUrl when fetched does not return a valid file
  if (imgUrl === '') {
    throw new ApiError('The thumbnailUrl is an empty string', HttpStatusCode.BAD_REQUEST);
  }
  const resThumbnail = request('GET', imgUrl);
  if (resThumbnail.statusCode !== 200) {
    throw new ApiError('The thumbnailUrl does not return to a valid type', HttpStatusCode.BAD_REQUEST);
  }

  // imgUrl when fetch is not a JPG or PNG image
  if (!isImageUrlValid(imgUrl)) {
    throw new ApiError('The thumbnailUrl, when fetched, is not a JPG or PNG file type', HttpStatusCode.BAD_REQUEST);
  }

  // find the quiz that quizId in parameters refers to
  const index = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === matchedToken.userId && quiz.quizId === quizId));
  dataStore.quizzes[index].thumbnailUrl = imgUrl;

  // Update timeLastEdited for the quiz
  const date = getUnixTime(new Date());
  dataStore.quizzes[index].timeLastEdited = date;

  setAndSave(dataStore);
  return {};
}

export {
  quizThumbnailUpdate
};
