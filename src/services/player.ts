
import { getData } from "../dataStore";
import { ApiError } from "../errors/ApiError";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import { Player } from "../dataStore";
import { SessionStates } from "../enums/SessionStates";
import { getUnixTime } from 'date-fns';
import { findQuestionByQuiz, findQuizById, findToken, getRandomColorAndRemove, getTotalDurationOfQuiz, isImageUrlValid, setAndSave, tokenValidation } from './otherService';
import request from 'sync-request-curl';
import { generateRandomString } from "./otherService";

interface joinGuestPlayerReturn {
	PlayerId: number
}


function joinGuestPlayer(sessionId: number, name: string): joinGuestPlayerReturn | void {
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

	//generate playerId
	const playerId = dataStore.maxPlayerId + 1;

	const newPlayer: Player = {
		'playerId': playerId,
		'playerName': name,
		'playerScore': 0,
	}

	
	dataStore.sessions[sessionIdIndex].sessionPlayers.push(newPlayer);
	return { 'PlayerId': playerId }

}

export { joinGuestPlayer }