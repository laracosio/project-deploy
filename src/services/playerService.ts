
import { getData } from '../dataStore';
import { ApiError } from '../errors/ApiError';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { Player, PSInfo, InputMessage, Message, } from '../dataStore';
import { SessionStates } from '../enums/SessionStates';
import { generateRandomString, findPlayerName, findSessionByPlayerId, playerValidation, setAndSave } from './otherService';
import { getUnixTime } from 'date-fns';


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

/**
 * This function lets a guest join as a player in a session
 * @param sessionId
 * @param name
 * @returns joinGuestPlayerReturn
*/
function joinGuestPlayer(sessionId: number, name: string): JoinGuestPlayerReturn {
  const dataStore = getData();
  const sessionIdHolder = dataStore.sessions.find(session => session.sessionId === sessionId);
  
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
    sessionIdHolder.sessionState = SessionStates.QUESTION_COUNTDOWN;
  }
  return { playerId: playerId };
}

/**
 * This returns the status of the guest player in a session
 * @param playerId
 * @returns GuestPlayerStatusReturn
*/
function guestPlayerStatus (playerId: number): GuestPlayerStatusReturn {
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

export { joinGuestPlayer, guestPlayerStatus };