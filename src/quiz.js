
/**
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
 * @param {number} authUserId - unique identifier for authorised user
 * @param {number} quizId - unique identifier for quiz
 * @returns {quizId: 1, name: string, timeCreated: number, timeLastEdited: number, description: string}
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