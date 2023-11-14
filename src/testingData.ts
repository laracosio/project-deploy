import { QuestionCreate, InputMessage } from './dataStore';

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
const stringOf1QuizIDs = '[1]';
const stringOf2QuizIDs = '[1,2]';
const stringOf3QuizIDs = '[1,2,3]';
const validAutoStartNum = 25;
const invalidAutoStartNum = 51;
const validQuestionInput1: QuestionCreate = {
  question: 'Who is the Monarch of England?',
  duration: 4,
  points: 5,
  answers: [
    { answer: 'Prince Charles', correct: true },
    { answer: 'Shrek', correct: false },
    { answer: 'Prince Charming', correct: false },
    { answer: 'Rumpelstiltskin', correct: false },
  ]
};

const validQuestionInput2: QuestionCreate = {
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
};

const validQuestionInput3: QuestionCreate = {
  question: 'Who was Queen Victoria married to?',
  duration: 2,
  points: 4,
  answers: [
    {
      answer: 'George Windsor',
      correct: false
    },
    {
      answer: 'Leopold I',
      correct: false
    },
    {
      answer: 'Philip of Greece',
      correct: false
    },
    {
      answer: 'Albert of SCG',
      correct: true
    }
  ]
};

const validQuestionInput1V2: QuestionCreate = {
  question: 'Who is the Monarch of England?',
  duration: 4,
  points: 5,
  answers: [
    { answer: 'Prince Charles', correct: true },
    { answer: 'Shrek', correct: false },
    { answer: 'Prince Charming', correct: false },
    { answer: 'Rumpelstiltskin', correct: false },
  ],
  thumbnailUrl: 'https://i.imgur.com/LIEpjAp.jpg'
};

const validQuestionInput2V2: QuestionCreate = {
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
  ],
  thumbnailUrl: 'https://www.historic-uk.com/wp-content/uploads/2018/11/henry-Vii.jpg'
};

const validQuestionInput3V2: QuestionCreate = {
  question: 'Who was Queen Victoria married to?',
  duration: 2,
  points: 4,
  answers: [
    {
      answer: 'George Windsor',
      correct: false
    },
    {
      answer: 'Leopold I',
      correct: false
    },
    {
      answer: 'Philip of Greece',
      correct: false
    },
    {
      answer: 'Albert of SCG',
      correct: true
    }
  ],
  thumbnailUrl: 'https://i.redd.it/ke4avpej4a481.jpg'
};

const validCreateQuestion: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

const invalidQCShortQuestion: QuestionCreate = {
  question: 'Who',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

const invalidQCLongQuestion: QuestionCreate = {
  question: 'Who is laras bestest boy cat who has short term memory lost but still the best in the world  ?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

const invalidQCOneAnswers: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true }
  ]
};
const invalidQCManyAnswers: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Zuko', correct: false },
    { answer: 'Katara', correct: false },
    { answer: 'Aamg', correct: false },
    { answer: 'Toph', correct: false },
    { answer: 'Ty lee', correct: false },
    { answer: 'Sokka', correct: false },
  ]
};

const invalidQCDurationNegative: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: -1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

const invalidQCDurationExceeds: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 190,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};
const invalidQCNoPoints: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 10,
  points: 0,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};
const invalidQCPointsExceeds: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 10,
  points: 20,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ],
};

const invalidQCEmptyAnswer: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: '', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

const invalidQCLongAnswer: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'HamitochondriaHamsterHamletHammyBoy', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

const invalidQCDuplicateAnswers: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};
const invalidQCNoAnswers: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

// update
const validUpdateQuestion: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Coco', correct: true },
    { answer: 'Bob', correct: false },
    { answer: 'Frankie', correct: false }
  ]
};
const invalidUpdateQuestionShortQuestion: QuestionCreate = {
  question: 'Who',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Coco', correct: true },
    { answer: 'Bob', correct: false },
    { answer: 'Frankie', correct: false }
  ]
};

const invalidUpdateQuestionLongQuestion: QuestionCreate = {
  question: 'Who is laras bestest baby girl cat meowmeow who brings in snakes and frogs and salamanders inside the house?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Coco', correct: true },
    { answer: 'Bob', correct: false },
    { answer: 'Frankie', correct: false }
  ]
};

const invalidUpdateQuestionManyAnswers: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Coco', correct: true },
    { answer: 'Zuko', correct: false },
    { answer: 'Katara', correct: false },
    { answer: 'Aamg', correct: false },
    { answer: 'Toph', correct: false },
    { answer: 'Ty lee', correct: false },
    { answer: 'Sokka', correct: false }
  ]
};

const invalidUpdateQuestionOneAnswer: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Coco', correct: true }
  ]
};

const invalidUpdateQuestionNegativeDuration: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: -1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Coco', correct: true },
    { answer: 'Bob', correct: false },
    { answer: 'Frankie', correct: false }
  ]
};

const invalidUpdateQuestionMoreThan180: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: 190,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Coco', correct: true },
    { answer: 'Bob', correct: false },
    { answer: 'Frankie', correct: false }
  ]
};

const invalidUpdateQuestionZeroPoints: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: 5,
  points: 0,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Coco', correct: true },
    { answer: 'Bob', correct: false },
    { answer: 'Frankie', correct: false }
  ]
};

const invalidUpdateQuestionMoreThan10Points: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: 5,
  points: 13,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Coco', correct: true },
    { answer: 'Bob', correct: false },
    { answer: 'Frankie', correct: false }
  ]
};

const invalidUpdateQuestionBlankAnswer: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: 10,
  points: 5,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Coco', correct: true },
    { answer: 'Bob', correct: false },
    { answer: '', correct: false },
  ]
};

const invalidUpdateQuestionLongAnswer: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: 10,
  points: 3,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'CocoCokesCokieCocoGirl Aling Maliit Best Girl Very Loving', correct: true },
    { answer: 'Bob', correct: false },
    { answer: 'Frankie', correct: false },
  ]
};

const invalidUpdateQuestionDuplicateAnswer: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: 10,
  points: 3,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Coco', correct: true },
    { answer: 'Bob', correct: false },
    { answer: 'Coco', correct: true },
    { answer: 'Frankie', correct: false },
  ]
};

const invalidUpdateQuestionNoCorrectAnswer: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: 10,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
    { answer: 'Frankie', correct: false },
  ],
};

const validCreateQuestion2: QuestionCreate = {
  question: 'Whos Laras favourite singer?',
  duration: 10,
  points: 2,
  answers: [
    { answer: 'Taylor Swift', correct: true },
    { answer: 'The Weeknd', correct: true },
    { answer: 'Frank Ocean', correct: false }
  ]
};

const validCreateQuestionV2PNG: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ],
  thumbnailUrl: 'https://www.fnordware.com/superpng/pnggrad16rgb.png'
};

const invalidCreateQuestionV2EmptyURL: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ],
  thumbnailUrl: ''
};

const invalidCreateQuestionV2InvalidURL: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ],
  thumbnailUrl: 'https://www.google.com/some/picture/ad16rgb.png'
};

const invalidCreateQuestionV2NotJPGPNG: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ],
  thumbnailUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzduNXllYWFjaGd6emV3bmtvanRvMTFmanhjYnFxN2ZzNDA4ZjgxdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0G16FRujv2fiD3Ne/giphy.gif'
};

const validCreateQuestionV2JPG: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ],
  thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
};

const validUpdateQuestionV2PNG: QuestionCreate = {
  question: 'Who is laras OG best boy cat ?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: false },
    { answer: 'Salem', correct: true },
    { answer: 'Bob', correct: false },
  ],
  thumbnailUrl: 'https://www.fnordware.com/superpng/pnggrad16rgb.png'
};

const invalidCreateQuestionV2URLEmpty: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ],
  thumbnailUrl: ''
};

const invalidCreateQuestionV2URLInvalid: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ],
  thumbnailUrl: 'https://www.fnordware.com/ggrad16rgb.png'
};

const invalidCreateQuestionV2URLNotPNGJPG: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ],
  thumbnailUrl: 'https://media.giphy.com/media/l0G16FRujv2fiD3Ne/giphy.gif'
};

const msg1: InputMessage = {
  messageBody: 'This is the first msg'
};
const msg2: InputMessage = {
  messageBody: 'This is the second msg'
};
const msg3: InputMessage = {
  messageBody: 'This is the third msg'
};
const noMsg: InputMessage = {
  messageBody: ''
};
const longMessage: InputMessage = {
  messageBody: 'Into each life some rain must fall. But too much is falling in mine. Into each heart some tears must fall. But someday the sun will shine.'
};

export const postQuestionBody = {
  questionBody: {
    question: 'Test question',
    duration: 3,
    points: 5,
    answers: [
      { answer: 'Prince Charles', correct: true },
      { answer: 'Queen Charles', correct: false },
      { answer: 'King Charles', correct: false },
      { answer: 'Princess Charles', correct: false },
    ],
  }
};

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
  stringOf1QuizIDs,
  stringOf2QuizIDs,
  stringOf3QuizIDs,
  validQuestionInput1,
  validQuestionInput2,
  validQuestionInput3,
  validQuestionInput1V2,
  validQuestionInput2V2,
  validQuestionInput3V2,
  validCreateQuestion,
  invalidQCShortQuestion,
  invalidQCLongQuestion,
  invalidQCOneAnswers,
  invalidQCManyAnswers,
  invalidQCDurationNegative,
  invalidQCDurationExceeds,
  invalidQCNoPoints,
  invalidQCPointsExceeds,
  invalidQCEmptyAnswer,
  invalidQCLongAnswer,
  invalidQCDuplicateAnswers,
  invalidQCNoAnswers,
  validUpdateQuestion,
  invalidUpdateQuestionShortQuestion,
  invalidUpdateQuestionLongQuestion,
  invalidUpdateQuestionManyAnswers,
  invalidUpdateQuestionOneAnswer,
  invalidUpdateQuestionNegativeDuration,
  invalidUpdateQuestionMoreThan180,
  invalidUpdateQuestionZeroPoints,
  invalidUpdateQuestionMoreThan10Points,
  invalidUpdateQuestionBlankAnswer,
  invalidUpdateQuestionLongAnswer,
  invalidUpdateQuestionDuplicateAnswer,
  invalidUpdateQuestionNoCorrectAnswer,
  validCreateQuestion2,
  invalidCreateQuestionV2URLNotPNGJPG,
  invalidCreateQuestionV2URLInvalid,
  invalidCreateQuestionV2URLEmpty,
  validUpdateQuestionV2PNG,
  validCreateQuestionV2JPG,
  invalidCreateQuestionV2NotJPGPNG,
  invalidCreateQuestionV2InvalidURL,
  invalidCreateQuestionV2EmptyURL,
  validCreateQuestionV2PNG,
  msg1,
  msg2,
  msg3,
  noMsg,
  longMessage,
  validAutoStartNum,
  invalidAutoStartNum
};
