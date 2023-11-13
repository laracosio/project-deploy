
import { getData } from '../dataStore';
import { ApiError } from '../errors/ApiError';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { Player, PSInfo } from '../dataStore';
import { SessionStates } from '../enums/SessionStates';
import { generateRandomString } from './otherService';

interface joinGuestPlayerReturn {
  playerId: number;
}

interface GuestPlayerStatusReturn {
  state: string;
  numQuestions: number;
  atQuestion: number;
}

function joinGuestPlayer(sessionId: number, name: string): joinGuestPlayerReturn {
  const dataStore = getData();
  const sessionIdIndex = dataStore.sessions.findIndex(session => session.sessionId === sessionId);
  const sessionIdHolder = dataStore.sessions.find(session => session.sessionId === sessionId);

  // check if name is already taken
  const takenName = dataStore.sessions[sessionIdIndex].sessionPlayers.some(player => player.playerName === name);
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
      isTaken = dataStore.sessions[sessionIdIndex].sessionPlayers.some(player => player.playerName === name);
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
  dataStore.sessions[sessionIdIndex].sessionPlayers.push(newPlayer);
  
  //autostarting the quiz if desired number of players are achieved
  if (dataStore.sessions[sessionIdIndex].sessionPlayers.length === dataStore.sessions[sessionIdIndex].autoStartNum) {
    dataStore.sessions[sessionIdIndex].sessionState = SessionStates.QUESTION_COUNTDOWN; 
  }
  return { playerId: playerId };
}

function GuestPlayerStatus (playerId: number): GuestPlayerStatusReturn {
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
    numQuestions: atQuestion,
    atQuestion: numQuestions
  };

  return getPlayerStatus;
}

export { joinGuestPlayer, GuestPlayerStatus };
