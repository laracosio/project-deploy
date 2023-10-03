import { getData, setData } from './dataStore';
import { getUnixTime } from 'date-fns';

//Stub function for adminQuizInfo by Lara

/**
 * Get all of the relevant information about the current quiz.
 * 
 * @param {number} authUserId 
 * @param {number} quizId 
 * @returns {quizId: number, name: string, timeCreated: number, timeLastEdited: number, description: string}
 */

function adminQuizInfo (authUserId, quizId) {
	let dataStore = getData();
	// check authUserId is valid
	if (!dataStore.users.some(user => user.userId === authUserId)) {
		return { error: 'Invalid user' };
	}

	// check quizId is valid
	if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
		return { error: 'Invalid quiz ID'};
	}

	// check valid quizId is owned by the current user
	if (dataStore.quizzes.some((quiz) => (!(quiz.quizOwner === authUserId) && quiz.quizId === quizId))) {
		return { error: 'Quiz ID not owned by this user' };
	}

	const quizMatch = dataStore.quizzes.find((quiz) => (quiz.quizOwner === authUserId && quiz.quizId === quizId));

	return quizMatch;
}

/**
 * Given basic details about a new quiz, create one for  the logged in user.
 * 
 * @param {number} authUserId - unique identifier for authorised user
 * @param {string} name - of quiz
 * @param {string} description - of quiz
 * @returns {quizId: 2}
 */
function adminQuizCreate(authUserId, name, description) {
	let dataStore = getData();

	// check authUserId is valid
	if (!dataStore.users.some(user => user.userId === authUserId)) {
		return { error: 'Invalid user' };
	}

	// check quiz name only contains alphanumeric characters and spaces
	if (!name.match(/^[a-zA-Z0-9\s]+$/)) {
		return { error: 'Invalid name, must not contain special characters' };
	}

	// check quiz name is between 3 and 30 characters long
	if (name.length < 3 || name.length > 30) {
		return { error: 'Invalid name length'};
	}
	// check quiz name doesn't already exist in current user's list
	if (dataStore.quizzes.some((quiz) => (quiz.quizOwner === authUserId && quiz.name === name))) {
		return { error: 'Quiz name already in use' };
	}

	// check description is within 100 characters
	if (description.length > 100) {
		return { error: 'Description must be less than 100 characters' };
	}

	let newQuizId = dataStore.quizzes.length + 1;
	const date = getUnixTime(new Date());

	const newQuiz = {
		quizId: newQuizId,
		name: name,
		timeCreated: date,
		timeLastEdited: date,
		description: description,
		quizOwner: authUserId,
	}
  
	dataStore.quizzes.push(newQuiz);
	setData(dataStore);
    return {
			quizId: newQuizId,
    }
}

/**
 * Given a particular quiz, permanently remove the quiz.
 * 
 * @param {Number} authUserId - unique identifier for user
 * @param {number} quizId - unique identifier for quiz
 * @returns {{error: string}}
 */
function adminQuizRemove(authUserId, quizId) {
  let dataStore = getData();
  
  if (!dataStore.users.some(user => user.userId === authUserId)) {
		return { error: 'Invalid userId' };
	}
  if (!dataStore.quizzes.some(quiz => quiz.quizId === quizId)) {
		return { error: 'Invalid quizId' };
	}
  if (dataStore.quizzes.some((quiz) => (quiz.quizOwner !== authUserId && quiz.quizId === quizId))) {
		return { error: 'User does not own quiz to remove' };
	}

  dataStore.quizzes.splice(dataStore.quizzes.findIndex(quiz => quiz.quizId === quizId), 1);

  setData(dataStore);
  return {}
}

//Stub function for adminQuizList made by Lara
/**
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * 
 * @param {number} authUserId 
 * @returns {quizzes: [{quizId: number, name: string}]}
 * @returns {{error: string}}
 * 
 */

function adminQuizList (authUserId) {
	let dataStore = getData();

	// check authUserId is valid
	if (!dataStore.users.some(user => user.userId === authUserId)) {
		return { error: 'Invalid user' };
	}

	// find all user quizzes and add to an array
	let userQuizList = [];
	dataStore.quizzes.forEach((quiz) => {
		if (quiz.quizOwner === authUserId) {
			const obj = {
				quizId: quiz.quizId,
				name: quiz.name,
			}
			userQuizList.push(obj);
		}
	})
	
	return {
		quizzes: userQuizList
	};    
}

//Stub function for adminQuizNameUpdate - Josh
/**
 * Given a particular quiz, change the name of the quiz
 * 
 * @param {number} authUserId
 * @param {number} quizId
 * @param {string} name
 * @returns {{error: string}}
 * 
 */

function adminQuizNameUpdate (authUserId, quizId, name) {
	
	let dataStore = getData();
	
	// check authUserId is valid
	if (!dataStore.users.some(user => user.userId === authUserId)) {
		return { error: 'Invalid user ID' };
	}

	// check quizId is valid
	if (!dataStore.quizzes.some((quiz) => quiz.quizId === quizId)) {
		return { error: 'Invalid quiz ID' };
	}

	// check valid quizId is owned by the current user
	if (dataStore.quizzes.some((quiz) => (!(quiz.quizOwner === authUserId) && quiz.quizId === quizId))) {
		return { error: 'Quiz ID not owned by this user' };
	}
	
	// check quiz name only contains alphanumeric characters and spaces
	if (!name.match(/^[a-zA-Z0-9\s]+$/)) {
		return { error: 'Name cannot contain special characters' };
	}

	// check quiz name is between 3 and 30 characters long
	if (name.length < 3 || name.length > 30) {
		return { error: 'Invalid name length' };
	}
	// check quiz name doesn't already exist in current user's list
	if (dataStore.quizzes.some((quiz) => (quiz.quizOwner === authUserId && quiz.name === name))) {
		return { error: 'Quiz name already exists'};
	}
	
	var index = dataStore.quizzes.findIndex((quiz) => (quiz.quizOwner === authUserId && quiz.quizId === quizId));

	quizzes[index].name = name;

	return {}
}


//Stub function for adminQuizDescriptionUpdate - Josh
/**
 * Given a particular quiz, change the description of the quiz
 * 
 * @param {number} authUserId
 * @param {number} quizId
 * @param {string} description
 * @returns {{error: string}}
 * 
 */

function adminQuizDescriptionUpdate (authUserId, quizId, description) {
	return {}
}

export { adminQuizInfo, adminQuizList, adminQuizCreate, adminQuizRemove, adminQuizNameUpdate, adminQuizDescriptionUpdate };
