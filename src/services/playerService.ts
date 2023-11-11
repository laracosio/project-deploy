
import { getData } from "../dataStore";
import { ApiError } from "../errors/ApiError";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import { Player, playerIdSessionId } from "../dataStore";
import { SessionStates } from "../enums/SessionStates";
import { getUnixTime } from 'date-fns';
import { findQuestionByQuiz, findQuizById, findToken, getRandomColorAndRemove, getTotalDurationOfQuiz, isImageUrlValid, setAndSave, tokenValidation } from './otherService';
import request from 'sync-request-curl';
import { generateRandomString } from "./otherService";

interface joinGuestPlayerReturn {
	PlayerId: number
}

interface GuestPlayerStatusReturn {
	state: number,
	numQuestions: number,
	atQuestion: number
}


function joinGuestPlayer(sessionId: number, name: string): joinGuestPlayerReturn {
	const dataStore = getData();
	const sessionIdIndex = dataStore.sessions.findIndex(session => session.sessionId === sessionId);
	const sessionIdHolder = dataStore.sessions.find(session => session.sessionId === sessionId);
	if (!sessionIdIndex) {
		throw new ApiError('Session is not in LOBBY state', HttpStatusCode.BAD_REQUEST);
	}

	//check if name is already taken
	const takenName = dataStore.sessions[sessionIdIndex].sessionPlayers.some(player => player.playerName === name);
	if (takenName) {
		throw new ApiError('Name of user entered is not unique (compared to other users who have already joined)', HttpStatusCode.BAD_REQUEST);
	}

	//check if session state is in lobby
	if (sessionIdHolder.sessionState !== SessionStates.LOBBY) {
		throw new ApiError('Session is not in LOBBY state', HttpStatusCode.BAD_REQUEST);
	}

	//generate name if name is empty string
	if (name === '') {
		let isTaken;
		do {
			name = generateRandomString();
			isTaken = dataStore.sessions[sessionIdIndex].sessionPlayers.some(player => player.playerName === name);
		} while (isTaken);
	}

	//increment maxPlayerId by 1
	const playerId = dataStore.maxPlayerId + 1;

	const newPlayer: Player = {
		'playerId': playerId,
		'playerName': name,
		'playerScore': 0,
	}

	const NewPlayerSession: playerIdSessionId = {
		'playerId': playerId,
		'sessionId': sessionId
	}

	//update maxPlayerId
	dataStore.maxPlayerId = playerId;

	dataStore.playerIdSessionIds.push(NewPlayerSession);
	dataStore.sessions[sessionIdIndex].sessionPlayers.push(newPlayer);
	return { 'PlayerId': playerId }

}


function GuestPlayerStatus (playerId: Number): GuestPlayerStatusReturn {
	const dataStore = getData();
	
	const validPlayer = dataStore.playerIdSessionIds.some(ps => ps.playerId === playerId);
	if (!validPlayer) {
		throw new ApiError('Player ID does not exist', HttpStatusCode.BAD_REQUEST);
	}

	const playerStatus = dataStore.playerIdSessionIds.find(ps => ps.playerId === playerId);

	const state = dataStore.sessions[playerStatus.sessionId].sessionState;
	const atQuestion = dataStore.sessions[playerStatus.sessionId].atQuestion;
	const numQuestions = dataStore.sessions[playerStatus.sessionId].sessionQuiz.numQuestions;

	const getPlayerStatus: GuestPlayerStatusReturn = {
		state: state,
		numQuestions: atQuestion,
		atQuestion: numQuestions
	}

	return getPlayerStatus;

}


export { joinGuestPlayer, GuestPlayerStatus }