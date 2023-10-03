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
	return {
		quizId: 1,
		name: 'My Quiz',
		timeCreated: 1683125870,
		timeLastEdited: 1683125871,
		description: 'This is my quiz',
		}
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
 * @param {number} authUserId - unique identifier for authorised user
 * @param {number} quizId - unique identifier for quiz
 * @returns {quizId: 1, name: string, timeCreated: number, timeLastEdited: number, description: string}
 * @param {number} quizId - unique identifier for quiz
 * @returns {quizId: 1, name: string, timeCreated: number, timeLastEdited: number, description: string}
 * @returns {{error: string}}
 * 
 */

function adminQuizRemove(authUserId, quizId) {
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
 * 
 * @param {number} authUserId
 * @param {number} quizId
 * @param {string} name
 * @returns {{error: string}}
 * 
 */

function adminQuizNameUpdate (authUserId, quizId, name) {
    return {}
}


//Stub function for adminQuizDescriptionUpdate - Josh
/**
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

export { adminQuizList, adminQuizCreate };