/**
 * 
 * @param {string} email - unique email address
 * @param {string} password - password of user's choice
 * @param {string} nameFirst - user's first name
 * @param {string} nameLast - user's last name
 * @returns {{authUserId: number}}
 * @returns {{error: string}} on error
 */
function adminAuthRegister(email, password, nameFirst, nameLast) {
    return {
        authUserId: 1,
    };
}

 * Given a registered user's email and password returns their authUserId value.
 * @param {number} email - unique email address
 * @param {number} password - user's password
 * @return {{authUserId: number}} on successful log in
 * @returns {{error: string}} on error
 */

function adminAuthLogin(email, password) {
    return {
        authUserId: 1, 
    }
}
