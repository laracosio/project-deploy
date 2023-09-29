import { getData, setData } from './dataStore.js';

//Stub function for clear - Josh
/**
 * @param {void} 
 * @returns {void}
 * 
 */

function clear () {
    let store = getData();
    store.user = [];
    store.quiz =[];
    setData(store);
    return store;
}