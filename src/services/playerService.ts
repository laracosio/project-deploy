
import { getData } from "../dataStore";
import { ApiError } from "../errors/ApiError";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import { Player, PSInfo } from "../dataStore";
import { SessionStates } from "../enums/SessionStates";
import { generateRandomString } from "./otherService";

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
	console.log("dataStore: ", dataStore)
	const sessionIdIndex = dataStore.sessions.findIndex(session => session.sessionId === sessionId);
	const sessionIdHolder = dataStore.sessions.find(session => session.sessionId === sessionId);
	console.log('Here');
	//check if name is already taken

	const takenName = dataStore.sessions[sessionIdIndex].sessionPlayers.some(player => player.playerName === name);
	console.log('Here after taken name');
	if (takenName) {
		throw new ApiError('Name of user entered is not unique (compared to other users who have already joined)', HttpStatusCode.BAD_REQUEST);
	}
	console.log('Here 2');
	//check if session state is in lobby
	if (sessionIdHolder.sessionState !== SessionStates.LOBBY) {
		throw new ApiError('Session is not in LOBBY state', HttpStatusCode.BAD_REQUEST);
	}
	console.log('Here 3');
	//generate name if name is empty string
	if (name === '') {
		let isTaken;
		do {
			name = generateRandomString();
			isTaken = dataStore.sessions[sessionIdIndex].sessionPlayers.some(player => player.playerName === name);
		} while (isTaken);
	}
	console.log('Here 4');
	//increment maxPlayerId by 1
	const playerId = dataStore.maxPlayerId + 1;

	const newPlayer: Player = {
		'playerId': playerId,
		'playerName': name
	}

	const NewPlayerSession: PSInfo = {
		'playerId': playerId,
		'sessionId': sessionId
	}
	console.log('Here 5');
	//update maxPlayerId
	dataStore.maxPlayerId = playerId;

	dataStore.mapPS.push(NewPlayerSession);
	console.log('dataStore.sessions[sessionIdIndex]:', dataStore.sessions[sessionIdIndex]);
	dataStore.sessions[sessionIdIndex].sessionPlayers.push(newPlayer);
	return { 'playerId': playerId }

}


function GuestPlayerStatus (playerId: Number): GuestPlayerStatusReturn {
	const dataStore = getData();
	
	const validPlayer = dataStore.mapPS.some(ps => ps.playerId === playerId);
	if (!validPlayer) {
		throw new ApiError('Player ID does not exist', HttpStatusCode.BAD_REQUEST);
	}

	const playerStatus = dataStore.mapPS.find(ps => ps.playerId === playerId);

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