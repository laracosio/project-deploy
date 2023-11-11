import { Colours, Datastore } from './dataStore';
import { SessionStates } from './enums/SessionStates';
import { hashText } from './services/otherService';
import { person1, validQuestionInput1, validQuestionInput2V2, validQuestionInput3, validQuizDescription, validQuizName } from './testingData';

export const unitTestLobby: Datastore = {
  users: [
    {
      userId: 1,
      nameFirst: 'Pumpkin',
      nameLast: 'Pothos',
      password: hashText(person1.password),
      oldPasswords: [],
      email: 'p.pothos@unsw@unsw.edu.au',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0
    }
  ],
  quizzes: [
    {
      quizId: 1,
      name: validQuizName,
      timeCreated: 1699627684,
      timeLastEdited: 1699627684,
      description: validQuizDescription,
      quizOwner: 1,
      numQuestions: 3,
      questions: [
        {
          questionId: 1,
          question: validQuestionInput1.question,
          duration: validQuestionInput1.duration,
          points: validQuestionInput1.points,
          answers: [
            {
              answerId: 1,
              answer: validQuestionInput1.answers[0].answer,
              correct: validQuestionInput1.answers[0].correct,
              colour: Colours[0],
            },
            {
              answerId: 2,
              answer: validQuestionInput1.answers[1].answer,
              correct: validQuestionInput1.answers[1].correct,
              colour: Colours[1],
            },
            {
              answerId: 3,
              answer: validQuestionInput1.answers[2].answer,
              correct: validQuestionInput1.answers[2].correct,
              colour: Colours[2],
            },
            {
              answerId: 4,
              answer: validQuestionInput1.answers[3].answer,
              correct: validQuestionInput1.answers[3].correct,
              colour: Colours[3],
            }
          ],
          playersCorrectList: [],
          answerTimes: [],
          questionStartTime: 0,
        },
        {
          questionId: 2,
          question: validQuestionInput2V2.question,
          duration: validQuestionInput2V2.duration,
          thumbnailUrl: validQuestionInput2V2.thumbnailUrl,
          points: validQuestionInput2V2.points,
          answers: [
            {
              answerId: 1,
              answer: validQuestionInput2V2.answers[0].answer,
              correct: validQuestionInput2V2.answers[0].correct,
              colour: Colours[5],
            },
            {
              answerId: 2,
              answer: validQuestionInput2V2.answers[1].answer,
              correct: validQuestionInput2V2.answers[1].correct,
              colour: Colours[2],
            },
            {
              answerId: 3,
              answer: validQuestionInput2V2.answers[2].answer,
              correct: validQuestionInput2V2.answers[2].correct,
              colour: Colours[3],
            },
            {
              answerId: 4,
              answer: validQuestionInput2V2.answers[3].answer,
              correct: validQuestionInput2V2.answers[3].correct,
              colour: Colours[6],
            }
          ],
          playersCorrectList: [],
          answerTimes: [],
          questionStartTime: 0,
        },
        {
          questionId: 3,
          question: validQuestionInput3.question,
          duration: validQuestionInput3.duration,
          points: validQuestionInput3.points,
          answers: [
            {
              answerId: 1,
              answer: validQuestionInput3.answers[0].answer,
              correct: validQuestionInput3.answers[0].correct,
              colour: Colours[4],
            },
            {
              answerId: 2,
              answer: validQuestionInput3.answers[1].answer,
              correct: validQuestionInput3.answers[1].correct,
              colour: Colours[3],
            },
            {
              answerId: 3,
              answer: validQuestionInput3.answers[2].answer,
              correct: validQuestionInput3.answers[2].correct,
              colour: Colours[1],
            },
            {
              answerId: 4,
              answer: validQuestionInput3.answers[3].answer,
              correct: validQuestionInput3.answers[3].correct,
              colour: Colours[5],
            }
          ],
          playersCorrectList: [],
          answerTimes: [],
          questionStartTime: 0,
        }
      ],
      quizDuration: validQuestionInput1.duration + validQuestionInput2V2.duration + validQuestionInput3.duration,
      thumbnailUrl: 'https://en.wikipedia.org/wiki/Hello,_Love_%28Ella_Fitzgerald_album%29#/media/File:Hello,Love.jpg'
    },
  ],
  mapUT: [
    {
      token: '01df59de-7943-4e9e-bbae-c4ee254d55b6',
      userId: 1
    }
  ],
  trash: [],
  sessions: [
    {
      sessionId: 1,
      sessionQuiz: {
        quizId: 1,
        name: validQuizName,
        timeCreated: 1699627684,
        timeLastEdited: 1699627684,
        description: validQuizDescription,
        quizOwner: 1,
        numQuestions: 3,
        questions: [
          {
            questionId: 1,
            question: validQuestionInput1.question,
            duration: validQuestionInput1.duration,
            points: validQuestionInput1.points,
            answers: [
              {
                answerId: 1,
                answer: validQuestionInput1.answers[0].answer,
                correct: validQuestionInput1.answers[0].correct,
                colour: Colours[0],
              },
              {
                answerId: 2,
                answer: validQuestionInput1.answers[1].answer,
                correct: validQuestionInput1.answers[1].correct,
                colour: Colours[1],
              },
              {
                answerId: 3,
                answer: validQuestionInput1.answers[2].answer,
                correct: validQuestionInput1.answers[2].correct,
                colour: Colours[2],
              },
              {
                answerId: 4,
                answer: validQuestionInput1.answers[3].answer,
                correct: validQuestionInput1.answers[3].correct,
                colour: Colours[3],
              }
            ],
            playersCorrectList: [],
            answerTimes: [],
            questionStartTime: 0,
          },
          {
            questionId: 2,
            question: validQuestionInput2V2.question,
            duration: validQuestionInput2V2.duration,
            thumbnailUrl: validQuestionInput2V2.thumbnailUrl,
            points: validQuestionInput2V2.points,
            answers: [
              {
                answerId: 1,
                answer: validQuestionInput2V2.answers[0].answer,
                correct: validQuestionInput2V2.answers[0].correct,
                colour: Colours[5],
              },
              {
                answerId: 2,
                answer: validQuestionInput2V2.answers[1].answer,
                correct: validQuestionInput2V2.answers[1].correct,
                colour: Colours[2],
              },
              {
                answerId: 3,
                answer: validQuestionInput2V2.answers[2].answer,
                correct: validQuestionInput2V2.answers[2].correct,
                colour: Colours[3],
              },
              {
                answerId: 4,
                answer: validQuestionInput2V2.answers[3].answer,
                correct: validQuestionInput2V2.answers[3].correct,
                colour: Colours[6],
              }
            ],
            playersCorrectList: [],
            answerTimes: [],
            questionStartTime: 0,
          },
          {
            questionId: 3,
            question: validQuestionInput3.question,
            duration: validQuestionInput3.duration,
            points: validQuestionInput3.points,
            answers: [
              {
                answerId: 1,
                answer: validQuestionInput3.answers[0].answer,
                correct: validQuestionInput3.answers[0].correct,
                colour: Colours[4],
              },
              {
                answerId: 2,
                answer: validQuestionInput3.answers[1].answer,
                correct: validQuestionInput3.answers[1].correct,
                colour: Colours[3],
              },
              {
                answerId: 3,
                answer: validQuestionInput3.answers[2].answer,
                correct: validQuestionInput3.answers[2].correct,
                colour: Colours[1],
              },
              {
                answerId: 4,
                answer: validQuestionInput3.answers[3].answer,
                correct: validQuestionInput3.answers[3].correct,
                colour: Colours[5],
              }
            ],
            playersCorrectList: [],
            answerTimes: [],
            questionStartTime: 0,
          }
        ],
        quizDuration: validQuestionInput1.duration + validQuestionInput2V2.duration + validQuestionInput3.duration,
        thumbnailUrl: 'https://en.wikipedia.org/wiki/Hello,_Love_%28Ella_Fitzgerald_album%29#/media/File:Hello,Love.jpg'
      },
      sessionState: SessionStates.LOBBY,
      autoStartNum: 3,
      atQuestion: 0,
      sessionPlayers: [
        {
          playerId: 1,
          playerName: 'Ella',
        },
        {
          playerId: 2,
          playerName: 'Frank',
        },
        {
          playerId: 3,
          playerName: 'Tony',
        }
      ],
      messages: []
    }
  ],
  mapPS: [
    {
      sessionId: 1,
      playerId: 1
    },
    {
      sessionId: 1,
      playerId: 2
    },
    {
      sessionId: 1,
      playerId: 3
    }
  ],
  maxQuizId: 1,
  maxPlayerId: 3
};
