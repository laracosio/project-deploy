import { getUnixTime } from "date-fns";
import { Message, getData } from "../dataStore";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import { ApiError } from "../errors/ApiError";
import { findPlayerName, findSessionByPlayerId, playerValidation, setAndSave } from "./otherService";

const MAX_LENGTH = 100;

function sendMessage(playerId: number, message: string) {
  const dataStore = getData();

  // check message body
  if (!message) {
    throw new ApiError('message too short', HttpStatusCode.BAD_REQUEST);
  };
  if (message.length > MAX_LENGTH) {
    throw new ApiError('message too long', HttpStatusCode.BAD_REQUEST);
  }

  // check whether player is valid
  if (!playerValidation(playerId)) {
    throw new ApiError('player is invalid', HttpStatusCode.BAD_REQUEST);
  }

  // locate session to find playerName
  const matchedSession = findSessionByPlayerId(playerId);
  const playerName = findPlayerName(playerId, matchedSession.sessionId);

  const newMessage: Message = {
    messageBody: message,
    playerId: playerId, 
    playerName: playerName,
    timeSent: getUnixTime(new Date())
  }

  matchedSession.messages.push(newMessage);
  setAndSave(dataStore);

  return {};
}

export {
  sendMessage
}