import { helperAdminRegister } from "./other";
import { getData, setData } from "./dataStore";
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
    let dataStore = getData();
    if (!helperAdminRegister(email, password, nameFirst, nameLast, dataStore.user)) {
        return { error: 'Invalid registration details.'}
    }
    let newUserId = dataStore.user.length + 1;
    const newUser = {
        userId: newUserId,
        nameFirst: nameFirst,
        nameLast: nameLast,
        email: email,
        password: password,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
    }
    dataStore.user.push(newUser);
    setData(dataStore);
    return {
        authUserId: newUserId,
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
  /* add num of successful logins and unsuccessful logins */
  
  let dataStore = getData(); 
   
  const authUser = dataStore.user.find(user => user.email === email);
  //email does not belong to a user
  if(!authUser) {
    return {error: 'email does not belong to a user'}
  }
    
  // if password is incorrect
  if(authUser.password !== password) {
    authUser.numFailedPasswordsSinceLastLogin++;
    return {error: 'password is incorrect'}
  }

  const authUserId = authUser.userId;
  // if successful login, reset num of failed password
  authUser.numSuccessfulLogins++;
  authUser.numFailedPasswordsSinceLastLogin = 0;
  
  
  return {
    authUserId: authUserId
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

export { adminAuthRegister, adminAuthLogin }
