import { QuestionCreate, InputMessage } from './dataStore';

export const person1 = {
  email: 'h.simpson@springfield.com',
  password: 'quickend98',
  nameFirst: 'Homer',
  nameLast: 'Simpson',
  numSuccessfulLogins: 1,
  numFailedPasswordsSinceLastLogin: 2,
  userId: 1,
};

export const person2 = {
  email: 'm.simpson@springfield.com',
  password: 'jollyllama99',
  nameFirst: 'Marge',
  nameLast: 'Simpson',
};

export const person3 = {
  email: 'b.simpson@springfield.com',
  password: 'superwhite24',
  nameFirst: 'Bart',
  nameLast: 'Simpson',
};

export const person4 = {
  email: 'l.simpson@springfield.com',
  password: 'grayalarm30',
  nameFirst: 'Lisa',
  nameLast: 'Simpson',
  numSuccessfulLogins: 1,
  numFailedPasswordsSinceLastLogin: 0,
  userId: 4,
};

export const person5 = {
  email: 'b.gumble@springfield.com',
  password: 'freetree13',
  nameFirst: 'Barney',
  nameLast: 'Gumble',
};

export const person6 = {
  email: 'c.wiggum@springfield.com',
  password: 'golderror14',
  nameFirst: 'Clancy',
  nameLast: 'Wiggum',
};

export const person7 = {
  email: 'n.flanders@springfield.com',
  password: 'crazynorth79',
  nameFirst: 'Ned',
  nameLast: 'Flanders',
};

export const validQuizName = 'My Quiz 1';
export const newvalidQuizName = 'Renamed My Quiz 1';
export const invalidQuizName = 'qu!z n@me';
export const shortQuizName = 'hi';
export const longQuizName = 'this is longer than thirty characters';
export const validQuizDescription = 'This quiz is awesome';
export const newvalidQuizDescription = 'This new quiz description is awesome';
export const longQuizDescription = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean moon.';
export const stringOf1QuizIDs = '[1]';
export const stringOf2QuizIDs = '[1,2]';
export const stringOf3QuizIDs = '[1,2,3]';
export const validAutoStartNum = 25;
export const invalidAutoStartNum = 51;
export const validpngUrl1 = 'https://w7.pngwing.com/pngs/115/334/png-transparent-snoopy-illustration-snoopy-hug-happiness-greeting-snoopy-s-reunion-hug-happiness-greeting.png';
export const validpngUrl2 = 'https://i.pinimg.com/originals/cf/8a/11/cf8a11b44a748c4ce286fb020f920ada.png';
export const validjpgUrl1 = 'https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg';
export const validjpgUrl2 = 'https://i.kym-cdn.com/photos/images/original/001/468/202/b02.jpg';
export const invalidimgUrl = 'https://media.giphy.com/media/l0G16FRujv2fiD3Ne/giphy.gif';
export const unfetchableimgUrl = 'https://www.fnordware.com/ggrad16rgb.png';

export const longMultiChoice: QuestionCreate = {
  question: 'Who is the Monarch of England?',
  duration: 3,
  points: 5,
  answers: [
    { answer: 'Prince Charles', correct: true },
    { answer: 'Shrek', correct: true },
    { answer: 'Prince Charming', correct: false },
    { answer: 'Rumpelstiltskin', correct: false },
  ]
};

export const validQuestionInput1: QuestionCreate = {
  question: 'Who is the Monarch of England?',
  duration: 1,
  points: 5,
  answers: [
    { answer: 'Prince Charles', correct: true },
    { answer: 'Shrek', correct: false },
    { answer: 'Prince Charming', correct: false },
    { answer: 'Rumpelstiltskin', correct: false },
  ]
};

export const validQuestionInput2: QuestionCreate = {
  question: 'Who ended the War of Roses?',
  duration: 1,
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

export const validQuestionInput3: QuestionCreate = {
  question: 'Who was Queen Victoria married to?',
  duration: 3,
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

export const validQuestionInput1V2: QuestionCreate = {
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

export const validQuestionInput2V2: QuestionCreate = {
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

export const validQuestionInput3V2: QuestionCreate = {
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

export const validCreateQuestion: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 40,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

export const invalidQCShortQuestion: QuestionCreate = {
  question: 'Who',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

export const invalidQCLongQuestion: QuestionCreate = {
  question: 'Who is laras bestest boy cat who has short term memory lost but still the best in the world  ?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

export const invalidQCOneAnswers: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true }
  ]
};

export const invalidQCManyAnswers: QuestionCreate = {
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

export const invalidQCDurationNegative: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: -1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

export const invalidQCDurationExceeds: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 190,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

export const invalidQCNoPoints: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 10,
  points: 0,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

export const invalidQCPointsExceeds: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 10,
  points: 20,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ],
};

export const invalidQCEmptyAnswer: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Hamlet', correct: true },
    { answer: '', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

export const invalidQCLongAnswer: QuestionCreate = {
  question: 'Who is laras best boy cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'HamitochondriaHamsterHamletHammyBoy', correct: true },
    { answer: 'Coco', correct: false },
    { answer: 'Bob', correct: false },
  ]
};

export const invalidQCDuplicateAnswers: QuestionCreate = {
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

export const invalidQCNoAnswers: QuestionCreate = {
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
export const validUpdateQuestion: QuestionCreate = {
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

export const invalidUpdateQuestionShortQuestion: QuestionCreate = {
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

export const invalidUpdateQuestionLongQuestion: QuestionCreate = {
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

export const invalidUpdateQuestionManyAnswers: QuestionCreate = {
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

export const invalidUpdateQuestionOneAnswer: QuestionCreate = {
  question: 'Who is laras best girl cat?',
  duration: 1,
  points: 2,
  answers: [
    { answer: 'Coco', correct: true }
  ]
};

export const invalidUpdateQuestionNegativeDuration: QuestionCreate = {
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

export const invalidUpdateQuestionMoreThan180: QuestionCreate = {
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

export const invalidUpdateQuestionZeroPoints: QuestionCreate = {
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

export const invalidUpdateQuestionMoreThan10Points: QuestionCreate = {
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

export const invalidUpdateQuestionBlankAnswer: QuestionCreate = {
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

export const invalidUpdateQuestionLongAnswer: QuestionCreate = {
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

export const invalidUpdateQuestionDuplicateAnswer: QuestionCreate = {
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

export const invalidUpdateQuestionNoCorrectAnswer: QuestionCreate = {
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

export const validCreateQuestion2: QuestionCreate = {
  question: 'Whos Laras favourite singer?',
  duration: 10,
  points: 2,
  answers: [
    { answer: 'Taylor Swift', correct: true },
    { answer: 'The Weeknd', correct: true },
    { answer: 'Frank Ocean', correct: false }
  ]
};

export const validCreateQuestionV2PNG: QuestionCreate = {
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

export const invalidCreateQuestionV2EmptyURL: QuestionCreate = {
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

export const invalidCreateQuestionV2InvalidURL: QuestionCreate = {
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

export const invalidCreateQuestionV2NotJPGPNG: QuestionCreate = {
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

export const validCreateQuestionV2JPG: QuestionCreate = {
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

export const validUpdateQuestionV2PNG: QuestionCreate = {
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

export const invalidCreateQuestionV2URLEmpty: QuestionCreate = {
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

export const invalidCreateQuestionV2URLInvalid: QuestionCreate = {
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

export const invalidCreateQuestionV2URLNotPNGJPG: QuestionCreate = {
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

export const msg1: InputMessage = {
  messageBody: 'This is the first msg'
};
export const msg2: InputMessage = {
  messageBody: 'This is the second msg'
};
export const msg3: InputMessage = {
  messageBody: 'This is the third msg'
};
export const noMsg: InputMessage = {
  messageBody: ''
};
export const longMessage: InputMessage = {
  messageBody: 'Into each life some rain must fall. But too much is falling in mine. Into each heart some tears must fall. But someday the sun will shine.'
};
