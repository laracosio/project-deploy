
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
        name: 'Interation 0 Quiz',
        timeCreated: 0920,
        timeLastEdited: 0921,
        description: 'This is my quiz for Iteration 0',
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
    return {
        quizId: 2,
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
    return {
        quizId: 1,
        name: 'My Quiz',
        timeCreated: 2009230900,
        timeLastEdited: 2009231044,
        description: 'This is my quiz',
    }
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
    return { quizzes: [
        {
          quizId: 1,
          name: 'My Quiz',
        }
      ]
    }     
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