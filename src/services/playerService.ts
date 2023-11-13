import { HttpStatusCode } from "../enums/HttpStatusCode";
import { calcAvgAnsTime, calcPercentCorrect, createQuestionResults, createUserRank, findSessionByPlayerId, generateRandomString, playerValidation } from "./otherService";
import { ApiError } from '../errors/ApiError';
import { PSInfo, Player, getData } from "../dataStore";
import { SessionStates } from "../enums/SessionStates";

interface JoinGuestPlayerReturn {
  playerId: number;
}

interface GuestPlayerStatusReturn {
  state: string;
  numQuestions: number;
  atQuestion: number;
}
export interface UserRanking {
  name: string, 
  score: number
}

export interface questionResultsReturn {
  questionId: number;
  playersCorrectList: string[];
  averageAnswerTime: number;
  percentCorrect: number;
}

interface PlyrFinRsltReturn {
  userRankedByScore: UserRanking[],
  questionResults: questionResultsReturn[],
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
 * Get the results for a particular question of the session a player is playing in
 * @param playerId 
 * @param questionPosition 
*/
export function playerQuestionResults(playerId: number, questionPosition: number): questionResultsReturn {
  const dataStore = getData();
  
  if (!playerValidation) {
    throw new ApiError('Player is invalid', HttpStatusCode.BAD_REQUEST);
  }
  
  const matchedSession = findSessionByPlayerId(playerId);
  if (questionPosition < 1 || questionPosition > matchedSession.sessionQuiz.numQuestions) {
    throw new ApiError('Question position is not valid for the session this player is in', HttpStatusCode.BAD_REQUEST);
  }
  
  if (matchedSession.sessionState !== SessionStates.ANSWER_SHOW) {
    throw new ApiError('Session is not yet up to this question', HttpStatusCode.BAD_REQUEST);
  }
  
  if (matchedSession.atQuestion !== questionPosition) {
    throw new ApiError('Session is not yet up to this question', HttpStatusCode.BAD_REQUEST);
  }
  
  const questionIndex = questionPosition - 1;
  const matchedQuestion = matchedSession.sessionQuiz.questions[questionIndex];
  const totalSessionPlayers = dataStore.mapPS.filter(elem => elem.sessionId === matchedSession.sessionId).length;
  
  return createQuestionResults(matchedQuestion, totalSessionPlayers);
}

export function playerFinalResults(playerId: number): PlyrFinRsltReturn {
  const dataStore = getData();
  
  if (!playerValidation) {
    throw new ApiError('Player is invalid', HttpStatusCode.BAD_REQUEST);
  }
  
  const matchedSession = findSessionByPlayerId(playerId);
  if (matchedSession.sessionState !== SessionStates.FINAL_RESULTS) {
    throw new ApiError('Session is not in FINAL_RESULTS state', HttpStatusCode.BAD_REQUEST);
  }
  
  const matchedSessionPlayers = matchedSession.sessionPlayers;
  const userRanking = createUserRank(matchedSessionPlayers);
  
  const totalSessionPlayers = dataStore.mapPS.filter(elem => elem.sessionId === matchedSession.sessionId).length;
  
  const questionResults: questionResultsReturn[] = [];
  matchedSession.sessionQuiz.questions.map(question => {
    questionResults.push(createQuestionResults(question, totalSessionPlayers))
  })
  
  return {
    userRankedByScore: userRanking,
    questionResults: questionResults
  }
  
}
export { joinGuestPlayer, guestPlayerStatus };