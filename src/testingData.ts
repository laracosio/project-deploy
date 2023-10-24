import { Question, QuestionCreate } from "./dataStore";

const person1 = {
  email: 'h.simpson@springfield.com',
  password: 'quickend98',
  nameFirst: 'Homer',
  nameLast: 'Simpson',
  numSuccessfulLogins: 1,
  numFailedPasswordsSinceLastLogin: 2,
  userId: 1,
};

const person2 = {
  email: 'm.simpson@springfield.com',
  password: 'jollyllama99',
  nameFirst: 'Marge',
  nameLast: 'Simpson',
};

const person3 = {
  email: 'b.simpson@springfield.com',
  password: 'superwhite24',
  nameFirst: 'Bart',
  nameLast: 'Simpson',
};

const person4 = {
  email: 'l.simpson@springfield.com',
  password: 'grayalarm30',
  nameFirst: 'Lisa',
  nameLast: 'Simpson',
  numSuccessfulLogins: 1,
  numFailedPasswordsSinceLastLogin: 0,
  userId: 4,
};

const person5 = {
  email: 'b.gumble@springfield.com',
  password: 'freetree13',
  nameFirst: 'Barney',
  nameLast: 'Gumble',
};

const person6 = {
  email: 'c.wiggum@springfield.com',
  password: 'golderror14',
  nameFirst: 'Clancy',
  nameLast: 'Wiggum',
};

const person7 = {
  email: 'n.flanders@springfield.com',
  password: 'crazynorth79',
  nameFirst: 'Ned',
  nameLast: 'Flanders',
};

const validQuizName = 'My Quiz 1';
const newvalidQuizName = 'Renamed My Quiz 1';
const invalidQuizName = 'qu!z n@me';
const shortQuizName = 'hi';
const longQuizName = 'this is longer than thirty characters';
const validQuizDescription = 'This quiz is awesome';
const newvalidQuizDescription = 'This new quiz description is awesome';
const longQuizDescription = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean moon.';
const validQuestionInput1: QuestionCreate = {
  question: 'Who is the Monarch of England?',
  duration: 4,
  points: 5,
  answers: [
    {
      answer: 'Prince Charles',
      correct: true
    },
    {
      answer: 'Shrek',
      correct: false
    },
    {
      answer: 'Prince Charming',
      correct: false
    },
    {
      answer: 'Rumpelstiltskin',
      correct: false
    }
  ]
}

const validQuestionInput2 = {
  question: 'Who ended the War of Roses?',
  duration: 5,
  points: 6,
  answers: [
    {
      answer: 'Margaret Beaufort',
      correct: false
    },
    {
      answer: 'Thomas Cromwell',
      correct: false
    },
    {
      answer: 'Henry Tudor',
      correct: true
    },
    {
      answer: 'Richard Plantagenet',
      correct: false
    }
  ]
}

export {
  person1,
  person2,
  person3,
  person4,
  person5,
  person6,
  person7,
  validQuizName,
  newvalidQuizName,
  invalidQuizName,
  shortQuizName,
  longQuizName,
  validQuizDescription,
  newvalidQuizDescription,
  longQuizDescription,
  validQuestionInput1,
  validQuestionInput2
};
