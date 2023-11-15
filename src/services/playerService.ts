
import { SubmittedAnswer, getData } from '../dataStore';
import { ApiError } from '../errors/ApiError';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { Player, PSInfo, InputMessage, Message } from '../dataStore';
import { SessionStates } from '../enums/SessionStates';
import { generateRandomString, findPlayerName, findSessionByPlayerId, playerValidation, setAndSave } from './otherService';
import { getUnixTime } from 'date-fns';
import { updateSessionStatus } from './sessionService';
import { AdminActions } from '../enums/AdminActions';
const MAX_LENGTH = 100;

interface viewMsgReturn {
  messages: Message[]
}

interface JoinGuestPlayerReturn {
  playerId: number;
}

interface GuestPlayerStatusReturn {
  state: string;
  numQuestions: number;
  atQuestion: number;
}

interface QuestionInfoReturn {

  'questionId': number,
  'question': string,
  'duration': number,
  'thumbnailUrl'?: string,
  'points': number,
  'answers': AnswerInfo[]

}

interface AnswerInfo {
  'answerId': number,
  'answer': string,
  'colour': string
}

/**
 * This function lets a guest join as a player in a session
 * @param sessionId
 * @param name
 * @returns joinGuestPlayerReturn
*/
export function joinGuestPlayer(sessionId: number, name: string): JoinGuestPlayerReturn {
  const dataStore = getData();
  const sessionIdHolder = dataStore.sessions.find(session => session.sessionId === sessionId);
  const sessionIdIndex = dataStore.sessions.findIndex(session => session.sessionId === sessionId);
  const quizIdHolder = dataStore.sessions[sessionIdIndex].sessionQuiz.quizId;
  const quizOwner = dataStore.sessions[sessionIdIndex].sessionQuiz.quizOwner;
  const quizOwnerInfo = dataStore.mapUT.find(person => person.userId === quizOwner);
  // check if name is already taken
  const takenName = sessionIdHolder.sessionPlayers.some(player => player.playerName === name);
  if (takenName) {
    throw new ApiError('Name of user entered is not unique (compared to other users who have already joined)', HttpStatusCode.BAD_REQUEST);
  }
  // check if session state is in lobby
  if (sessionIdHolder.sessionState !== SessionStates.LOBBY) {
    throw new ApiError('Session is not in LOBBY state', HttpStatusCode.BAD_REQUEST);
  }
  // generate name if name is empty string
  if (name === '') {
    let isTaken;
    do {
      name = generateRandomString();
      isTaken = sessionIdHolder.sessionPlayers.some(player => player.playerName === name);
    } while (isTaken);
  }
  // increment maxPlayerId by 1
  const playerId = dataStore.maxPlayerId + 1;

  const newPlayer: Player = {
    playerId: playerId,
    playerName: name
  };

  const NewPlayerSession: PSInfo = {
    sessionId: sessionId,
    playerId: playerId
  };
  // update maxPlayerId
  dataStore.maxPlayerId = playerId;

  dataStore.mapPS.push(NewPlayerSession);
  sessionIdHolder.sessionPlayers.push(newPlayer);

  // autostarting the quiz if desired number of players are achieved
  if (sessionIdHolder.sessionPlayers.length === sessionIdHolder.autoStartNum) {
    updateSessionStatus(quizIdHolder, sessionId, quizOwnerInfo.token, AdminActions.NEXT_QUESTION);
  }
  return { playerId: playerId };
}

/**
 * This returns the status of the guest player in a session
 * @param playerId
 * @returns GuestPlayerStatusReturn
*/
export function guestPlayerStatus (playerId: number): GuestPlayerStatusReturn {
  const dataStore = getData();

  const validPlayer = dataStore.mapPS.some(ps => ps.playerId === playerId);
  if (!validPlayer) {
    throw new ApiError('Player ID does not exist', HttpStatusCode.BAD_REQUEST);
  }

  const playerStatus = dataStore.mapPS.find(ps => ps.playerId === playerId);

  const sessionIdIndex = dataStore.sessions.findIndex(session => session.sessionId === playerStatus.sessionId);

  const state = dataStore.sessions[sessionIdIndex].sessionState;
  const atQuestion = dataStore.sessions[sessionIdIndex].atQuestion;
  const numQuestions = dataStore.sessions[sessionIdIndex].sessionQuiz.numQuestions;

  const getPlayerStatus: GuestPlayerStatusReturn = {
    state: state,
    numQuestions: numQuestions,
    atQuestion: atQuestion
  };

  return getPlayerStatus;
}

/**
 * Send a new chat message to everyone in the session
 * @param playerId - Id of player sending message
 * @param message - message being sent
 * @returns empty object on success
 * @returns error otherwise
 */
export function sendMessage(playerId: number, message: InputMessage): object {
  const dataStore = getData();

  // check message body
  if (!message.messageBody) {
    throw new ApiError('The message is empty.', HttpStatusCode.BAD_REQUEST);
  }
  if (message.messageBody.length > MAX_LENGTH) {
    throw new ApiError('The message too long.', HttpStatusCode.BAD_REQUEST);
  }

  // check whether player is valid
  if (!playerValidation(playerId)) {
    throw new ApiError('player ID does not exist', HttpStatusCode.BAD_REQUEST);
  }

  // locate session to find playerName
  const matchedSession = findSessionByPlayerId(playerId);
  const playerName = findPlayerName(playerId, matchedSession.sessionId);

  const newMessage: Message = {
    messageBody: message.messageBody,
    playerId: playerId,
    playerName: playerName,
    timeSent: getUnixTime(new Date())
  };

  matchedSession.messages.push(newMessage);
  setAndSave(dataStore);

  return {};
}

/**
 * Return all messages that are in the same session as the player
 * @param playerId - Id of player sending message
 * @returns all messages sent in session
 */
export function viewMessages(playerId: number): viewMsgReturn {
  // check whether player is valid
  if (!playerValidation(playerId)) {
    throw new ApiError('playerID is invalid', HttpStatusCode.BAD_REQUEST);
  }

  // locate session to find playerName
  const matchedSession = findSessionByPlayerId(playerId);

  return { messages: matchedSession.messages };
}

/**
 * return the current question information in a session
 * @param playerId
 * @param questionposition
 * @returns QuestionInfoReturn
 */
export function currentQuestionInfo(playerId: number, questionposition: number): QuestionInfoReturn {
  const dataStore = getData();

  // if player ID does not exist
  const isvalidPlayer = dataStore.mapPS.some(ps => ps.playerId === playerId);
  if (!isvalidPlayer) {
    throw new ApiError('Player ID does not exist', HttpStatusCode.BAD_REQUEST);
  }

  const playerInfo = dataStore.mapPS.find(ps => ps.playerId === playerId);
  const sessionIdIndex = dataStore.sessions.findIndex(session => session.sessionId === playerInfo.sessionId);

  const inSession = dataStore.sessions[sessionIdIndex];
  const questionPositionIndex = questionposition - 1;

  // position is not valid
  if (questionposition > inSession.sessionQuiz.numQuestions) {
    throw new ApiError('Question position is not valid for the session this player is in', HttpStatusCode.BAD_REQUEST);
  }
  // not in the question
  if (inSession.atQuestion !== questionposition) {
    throw new ApiError('Session is not currently on this question', HttpStatusCode.BAD_REQUEST);
  }
  // not in end or lobby state
  if (inSession.sessionState === SessionStates.END || inSession.sessionState === SessionStates.LOBBY) {
    throw new ApiError('Session is in LOBBY or END state', HttpStatusCode.BAD_REQUEST);
  }

  const answerInfoArray = [];

  for (const element of inSession.sessionQuiz.questions[questionPositionIndex].answers) {
    const answerBody = {
      answerId: element.answerId,
      answer: element.answer,
      colour: element.colour
    };
    answerInfoArray.push(answerBody);
  }
  if (inSession.sessionQuiz.questions[questionPositionIndex].thumbnailUrl !== undefined) {
    return {
      questionId: inSession.sessionQuiz.questions[questionPositionIndex].questionId,
      question: inSession.sessionQuiz.questions[questionPositionIndex].question,
      duration: inSession.sessionQuiz.questions[questionPositionIndex].duration,
      points: inSession.sessionQuiz.questions[questionPositionIndex].points,
      answers: answerInfoArray
    };
  }
  return {
    questionId: inSession.sessionQuiz.questions[questionPositionIndex].questionId,
    question: inSession.sessionQuiz.questions[questionPositionIndex].question,
    duration: inSession.sessionQuiz.questions[questionPositionIndex].duration,
    thumbnailUrl: inSession.sessionQuiz.questions[questionPositionIndex].thumbnailUrl,
    points: inSession.sessionQuiz.questions[questionPositionIndex].points,
    answers: answerInfoArray
  };
}

export function playerSubmitAnswers(playerId: number, questionposition: number, answerIds: number[]) {
  const dataStore = getData();

  // If player ID does not exist
  const isvalidPlayer = dataStore.mapPS.some(ps => ps.playerId === playerId);
  if (!isvalidPlayer) {
    throw new ApiError('Player ID does not exist', HttpStatusCode.BAD_REQUEST);
  }
  const playerInfo = dataStore.mapPS.find(ps => ps.playerId === playerId);
  const questionPositionIndex = questionposition - 1;
  const sessionIdIndex = dataStore.sessions.findIndex(session => session.sessionId === playerInfo.sessionId);
  const inSession = dataStore.sessions[sessionIdIndex];

  // position is not valid
  if (questionposition > inSession.sessionQuiz.numQuestions) {
    throw new ApiError('Question position is not valid for the session this player is in', HttpStatusCode.BAD_REQUEST);
  }
  // if sessionstate is not in quesition_open
  if (inSession.sessionState !== SessionStates.QUESTION_OPEN) {
    throw new ApiError('Session is not in QUESTION_OPEN state', HttpStatusCode.BAD_REQUEST);
  }
  // check if session is in this question
  if (inSession.atQuestion !== questionposition) {
    throw new ApiError('Session is not yet up to this questione', HttpStatusCode.BAD_REQUEST);
  }
  // check if answerId provided are not valid for this question
  const answerIdList = inSession.sessionQuiz.questions[questionPositionIndex].answers.map(answer => answer.answerId);
  for (const answer of answerIds) {
    if (!answerIdList.includes(answer)) {
      throw new ApiError('Answer IDs are not valid for this particular question', HttpStatusCode.BAD_REQUEST);
    }
  }
  // check if there are duplicate answer ids
  const seen = new Set();
  let isSeen = false;
  for (const item of answerIds) {
    if (seen.has(item)) {
      isSeen = true;
    }
    seen.add(item);
  }
  if (isSeen) {
    throw new ApiError('There are duplicate answer IDs provided', HttpStatusCode.BAD_REQUEST);
  }
  // if there are no answerIds provided
  if (answerIds.length === 0) {
    throw new ApiError('Less than 1 answer ID was submitted', HttpStatusCode.BAD_REQUEST);
  }
  // get timeSubmitted
  const dateNow = getUnixTime(new Date());
  const answerTime = (inSession.sessionQuiz.questions[questionPositionIndex].questionStartTime - dateNow);

  const submittedAnswers = dataStore.sessions[sessionIdIndex].sessionQuiz.questions[questionPositionIndex].submittedAnswers;
  const found = dataStore.sessions[sessionIdIndex].sessionQuiz.questions[questionPositionIndex].submittedAnswers.find(answer => answer.playerId === playerId);

  const answer: SubmittedAnswer = {
    playerId: playerId,
    answerIds: answerIds,
    timeSubmitted: answerTime,
  };

  if (found) {
    const answeredIndex = dataStore.sessions[sessionIdIndex].sessionQuiz.questions[questionPositionIndex].submittedAnswers.findIndex(answer => answer.playerId === playerId);
    submittedAnswers[answeredIndex] = answer;
  } else {
    submittedAnswers.push(answer);
  }

  return {};
}
