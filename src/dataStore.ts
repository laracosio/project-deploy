export interface ErrorObject {
  error: string
}

export interface AnswerCreate {
  answer: string,
  correct: boolean,
}

export interface QuestionCreate {
  question: string,
  duration: number,
  points: number,
  answers: AnswerCreate[],
}

export const Colours = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];

export interface User {
  userId: number,
  nameFirst: string,
  nameLast: string,
  password: string,
  email: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number
}

export interface Answer {
  answerId: number,
  answer: string,
  correct: boolean,
  colour: string,
}

export interface Question {
  questionId: number,
  question: string,
  duration: number,
  points: number,
  answers: Answer[],
}

export interface Quiz {
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  quizOwner: number,
  numQuestions: number,
  questions: Question[],
  quizDuration: number
}

export interface Token {
  sessionId: string,
  userId: number
}

interface Datastore {
  users: User[],
  quizzes: Quiz[],
  tokens: Token[],
  trash: Quiz[]
}

// YOU SHOULD MODIFY THIS OBJECT BELOW
let data: Datastore = {
  users: [],
  quizzes: [],
  tokens: [],
  trash: []
};

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: Datastore) {
  data = newData;
}

export { getData, setData };
