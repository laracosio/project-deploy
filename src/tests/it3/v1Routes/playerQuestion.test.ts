import { authRegisterRequest, quizCreateRequest, createQuizQuestionRequest } from "../../it2/serverTestHelperIt2";
import { person1, validQuizName, validQuizDescription, validCreateQuestion, validAutoStartNum, validCreateQuestion2 } from "../../../testingData";
import { sessionCreateRequest,joinGuestPlayerRequest, currentQuestionInfoRequest, playerSubmitAnswerRequest, quizInfoRequestV2, updateSessionRequest } from "../../serverTestHelperIt3";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";
import { clearRequest } from "../../it2/serverTestHelperIt2";
import { SessionStateMachine } from "../../../services/sesssionStateMachine";
import { SessionStates } from "../../../enums/SessionStates";
beforeEach(() => {
  clearRequest();
});
/*
describe('Successful tests: Current Question Information for a Player', () => {
  test('Current Question Information for a Player: Valid playerId and atQuestion', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = 'laraCosio';
    const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const player1Data = JSON.parse(player1.body.toString());
    const res = currentQuestionInfoRequest(player1Data.playerId, 1);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual(
      {
        "questionId": expect.any(Number),
        "question": expect.any(String),
        "duration": expect.any(Number),
        "points": expect.any(Number),
        "answers": [
          {
            "answerId": expect.any(Number),
            "answer": expect.any(String),
            "colour": expect.any(String)
          },
          {
            "answerId": expect.any(Number),
            "answer": expect.any(String),
            "colour": expect.any(String)
          },
          {
            "answerId": expect.any(Number),
            "answer": expect.any(String),
            "colour": expect.any(String)
          }
        ]
      }
    );
    expect(res.statusCode).toBe(HttpStatusCode.OK);
  });
});

describe('Unsuccessful tests: Current Question Information for a Player', () => {
  test('Unsuccessful: Current Question Information for a Player: Invalid PlayerId', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = 'laraCosio';
    joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const invalidPlayer = 13413;
    const res = currentQuestionInfoRequest(invalidPlayer, 1);
    const data = JSON.parse(res.body.toString());;
    expect(data).toStrictEqual(
      { error: expect.any(String) }
    );
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
  test('Unsuccessful: Current Question Information for a Player: If question position is not valid for the session this player is in', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = 'laraCosio';
    const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const player1Data = JSON.parse(player1.body.toString());

    const res = currentQuestionInfoRequest(player1Data.playerId,15525);
    const data = JSON.parse(res.body.toString());;
    expect(data).toStrictEqual(
      { error: expect.any(String) }
    );
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
  test('Unsuccessful: Current Question Information for a Player: If session is not currently on this question', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = 'laraCosio';
    const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const player1Data = JSON.parse(player1.body.toString());
    const invalidPosition = 2;
    const res = currentQuestionInfoRequest(player1Data.playerId, invalidPosition);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual(
      { error: expect.any(String) }
    );
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
});
  /*
  test('Unsuccessful: Current Question Information for a Player: Session is in LOBBY state', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = 'laraCosio';
    const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const player1Data = JSON.parse(player1.body.toString());
    //change sessionState here
    const res = currentQuestionInfoRequest(player1Data.playerId, 1);
    const data = JSON.parse(res.body.toString());;
    expect(data).toStrictEqual(
      { error: expect.any(String) }
    );
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
  test('Unsuccessful: Current Question Information for a Player: Session is in END state', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);

    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const name = 'laraCosio';
    const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name);
    const player1Data = JSON.parse(player1.body.toString());
    //change sessionState here 
    const res = currentQuestionInfoRequest(player1Data.playerId, 1);
    const data = JSON.parse(res.body.toString());;
    expect(data).toStrictEqual(
      { error: expect.any(String) }
    );
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
});
*/

describe('Successful tests: Player Submission of Answer(s)', () => {
  test('Successful tests: Player Submission of Answer(s): Valid playerId, valid atQuestion, and answerId', async () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    const question1Data = JSON.parse(question1.body.toString());
    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, 4);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const quizInfo = quizInfoRequestV2(user1Data.token, quiz1Data.quizId);
    const quizInfoParsed = JSON.parse(quizInfo.body.toString());
    const answers = quizInfoParsed.questions[0].answers;

    const name1 = 'lara';
    const name2 = 'carmen';
    const name3 = 'gina';
    const name4 = 'josh';
    updateSessionRequest(user1Data.token, quiz1Data.quizId, sesh1Data.sessionId, SessionStates.QUESTION_OPEN);
    const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name1);
    const player1Data = JSON.parse(player1.body.toString());
    console.log('player1Data: ', player1Data);
    const player2 = joinGuestPlayerRequest(sesh1Data.sessionId, name2);
    const player3 = joinGuestPlayerRequest(sesh1Data.sessionId, name3);
    const player4 = joinGuestPlayerRequest(sesh1Data.sessionId, name4);
    const player1Id = JSON.parse(player1.body.toString());
    //change session state 
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const res = playerSubmitAnswerRequest(player1Data.playerId, question1Data.questionId, answers[0].answerId);

    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({});
    expect(res.statusCode).toBe(HttpStatusCode.OK);
  });
});
/*
describe('Unsuccessful tests: Player Submission of Answer(s)', () => {
  test('Player Submission of Answer(s): If player ID does not exist', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    const question1Data = JSON.parse(question1.body.toString());
    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, 4);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const quizInfo = quizInfoRequestV2(user1Data.token, quiz1Data.quizId);
    const quizInfoParsed = JSON.parse(quizInfo.body.toString());
    const answers = quizInfoParsed.questions[question1Data].answers;
    
    const name1 = 'lara';
    const name2 = 'carmen';
    const name3 = 'gina';
    const name4 = 'josh';
    joinGuestPlayerRequest(sesh1Data.sessionId, name1);
    joinGuestPlayerRequest(sesh1Data.sessionId, name2);
    joinGuestPlayerRequest(sesh1Data.sessionId, name3);
    joinGuestPlayerRequest(sesh1Data.sessionId, name4);
    const invalidPlayer5 = 3849;
    //change session state here
    const res = playerSubmitAnswerRequest(invalidPlayer5, question1Data.questionId, answers[0].answerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
   test('Player Submission of Answer(s): If question position is not valid for the session this player is in', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    const question1Data = JSON.parse(question1.body.toString());
    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, 4);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const quizInfo = quizInfoRequestV2(user1Data.token, quiz1Data.quizId);
    const quizInfoParsed = JSON.parse(quizInfo.body.toString());
    const answers = quizInfoParsed.questions[question1Data].answers;
    
    const name1 = 'lara';
    const name2 = 'carmen';
    const name3 = 'gina';
    const name4 = 'josh';
    const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name1);
    const player1Data = JSON.parse(player1.body.toString());
    joinGuestPlayerRequest(sesh1Data.sessionId, name2);
    joinGuestPlayerRequest(sesh1Data.sessionId, name3);
   joinGuestPlayerRequest(sesh1Data.sessionId, name4);

    //change session state here
    const res = playerSubmitAnswerRequest(player1Data.playerId, 1425, answers[0].answerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
  
  test('Player Submission of Answer(s): Session is not in QUESTION_OPEN state', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    const question1Data = JSON.parse(question1.body.toString());
    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, 4);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const quizInfo = quizInfoRequestV2(user1Data.token, quiz1Data.quizId);
    const quizInfoParsed = JSON.parse(quizInfo.body.toString());
    const answers = quizInfoParsed.questions[question1Data].answers;
    
    const name1 = 'lara';
    const name2 = 'carmen';
    const name3 = 'gina';
    const name4 = 'josh';
    const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name1);
    const player1Data = JSON.parse(player1.body.toString());
    joinGuestPlayerRequest(sesh1Data.sessionId, name2);
    joinGuestPlayerRequest(sesh1Data.sessionId, name3);
    joinGuestPlayerRequest(sesh1Data.sessionId, name4);

    //change session state here
    //CHANGE SESSION STATE TO QUESTIONCLOSE
    const res = playerSubmitAnswerRequest(player1Data.playerId, question1Data.questionId, answers[0].answerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
  test('Player Submission of Answer(s): If session is not yet up to this question', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    const question2 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion2);
    const question1Data = JSON.parse(question1.body.toString());
    const question2Data = JSON.parse(question2.body.toString());
    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, validAutoStartNum);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const quizInfo = quizInfoRequestV2(user1Data.token, quiz1Data.quizId);
    const quizInfoParsed = JSON.parse(quizInfo.body.toString());
    const answers = quizInfoParsed.questions[question1Data].answers;
    
    const name1 = 'lara';
    const name2 = 'carmen';
    const name3 = 'gina';
    const name4 = 'josh';
    const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name1);
    const player1Data = JSON.parse(player1.body.toString());
    joinGuestPlayerRequest(sesh1Data.sessionId, name2);
    joinGuestPlayerRequest(sesh1Data.sessionId, name3);
    joinGuestPlayerRequest(sesh1Data.sessionId, name4);

    //change session state here
    const res = playerSubmitAnswerRequest(player1Data.playerId, question2Data.questionId, answers[0].answerId);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
   test('Player Submission of Answer(s): Answer IDs are not valid for this particular question', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    const user1Data = JSON.parse(user1.body.toString());
    const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
    const quiz1Data = JSON.parse(quiz1.body.toString());
    const question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
    const question2 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion2);
    const question1Data = JSON.parse(question1.body.toString());
    const question2Data = JSON.parse(question2.body.toString());
    const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, 4);
    const sesh1Data = JSON.parse(sesh1.body.toString());
    const quizInfo = quizInfoRequestV2(user1Data.token, quiz1Data.quizId);
    const quizInfoParsed = JSON.parse(quizInfo.body.toString());
    const answers = quizInfoParsed.questions[question1Data].answers;
    
    const name1 = 'lara';
    const name2 = 'carmen';
    const name3 = 'gina';
    const name4 = 'josh';
    const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name1);
    const player1Data = JSON.parse(player1.body.toString());
    joinGuestPlayerRequest(sesh1Data.sessionId, name2);
    joinGuestPlayerRequest(sesh1Data.sessionId, name3);
    joinGuestPlayerRequest(sesh1Data.sessionId, name4);

    //change session state here
    const res = playerSubmitAnswerRequest(player1Data.playerId, question2Data.questionId, answers[0].answerId + 130);
    const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });

    test('Player Submission of Answer(s): There are duplicate answer IDs provided', () => {
      const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
      const user1Data = JSON.parse(user1.body.toString());
      const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
      const quiz1Data = JSON.parse(quiz1.body.toString());
      const question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
      const question2 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion2);
      const question1Data = JSON.parse(question1.body.toString());
      const question2Data = JSON.parse(question2.body.toString());
      const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, 4);
      const sesh1Data = JSON.parse(sesh1.body.toString());
      const quizInfo = quizInfoRequestV2(user1Data.token, quiz1Data.quizId);
      const quizInfoParsed = JSON.parse(quizInfo.body.toString());
      const answers = quizInfoParsed.questions[question1Data].answers;
      
      const name1 = 'lara';
      const name2 = 'carmen';
      const name3 = 'gina';
      const name4 = 'josh';
      const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name1);
      const player1Data = JSON.parse(player1.body.toString());
      joinGuestPlayerRequest(sesh1Data.sessionId, name2);
      joinGuestPlayerRequest(sesh1Data.sessionId, name3);
      joinGuestPlayerRequest(sesh1Data.sessionId, name4);

      //change session state here
      const numArray: number[] = [answers[0].answerId, answers[1].answerId, answers[0].answerId]
      const res = playerSubmitAnswerRequest(player1Data.playerId, question2Data.questionId, numArray);
      const data = JSON.parse(res.body.toString());
      expect(data).toStrictEqual({ error: expect.any(String)});
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });

  test('Player Submission of Answer(s): Less than 1 answer ID was submitted', () => {
    const user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
      const user1Data = JSON.parse(user1.body.toString());
      const quiz1 = quizCreateRequest(user1Data.token, validQuizName, validQuizDescription);
      const quiz1Data = JSON.parse(quiz1.body.toString());
      const question1 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion);
      const question2 = createQuizQuestionRequest(quiz1Data.quizId, user1Data.token, validCreateQuestion2);
      const question1Data = JSON.parse(question1.body.toString());
      const question2Data = JSON.parse(question2.body.toString());
      const sesh1 = sessionCreateRequest(user1Data.token, quiz1Data.quizId, 4);
      const sesh1Data = JSON.parse(sesh1.body.toString());
      
      const name1 = 'lara';
      const name2 = 'carmen';
      const name3 = 'gina';
      const name4 = 'josh';
      const player1 = joinGuestPlayerRequest(sesh1Data.sessionId, name1);
      const player1Data = JSON.parse(player1.body.toString());
      joinGuestPlayerRequest(sesh1Data.sessionId, name2);
      joinGuestPlayerRequest(sesh1Data.sessionId, name3);
      joinGuestPlayerRequest(sesh1Data.sessionId, name4);
  
      //change session state here
      const numArray: number[] = [];
      const res = playerSubmitAnswerRequest(player1Data.playerId, question2Data.questionId, numArray);
      const data = JSON.parse(res.body.toString());
    expect(data).toStrictEqual({ error: expect.any(String)});
    expect(res.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
  });
  
});

*/