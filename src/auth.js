/**
 * Register a user with an email, password, and names, then returns their authUserId value.
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

/**
 * Given a registered user's email and password returns their authUserId value.
 * @param {number} email - unique email address
 * @param {number} password - user's password
 * @returns {{authUserId: number}} on successful log in
 * @returns {{error: string}} on error
*/
function adminAuthLogin(email, password) {
    return {
        authUserId: 1, 
    }
}

/**
 * Given an admin user's authUserId, return details about the user.
 * "name" is the first and last name concatenated with a single space between them
 * @param {number} authUserId - calling user's Id
 * @returns {user: {userId: number, email: string, 
 *                  numSuccessfulLogins: number, numFailedPasswordsSinceLastLogin: number}}
 * @returns {{error: string}} on error
 */
function adminUserDetails(authUserId) {
    return { 
        user:
        {
          userId: 1,
          name: 'Hayden Smith',
          email: 'hayden.smith@unsw.edu.au',
          numSuccessfulLogins: 3,
          numFailedPasswordsSinceLastLogin: 1,
        }
      }
}

export { adminAuthRegister };