
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
 * @param {number} authUserId - unique identifier for authorised user
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