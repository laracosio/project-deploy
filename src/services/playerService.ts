import { getUnixTime } from 'date-fns';
import { InputMessage, Message, getData } from '../dataStore';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiError } from '../errors/ApiError';
import { findPlayerName, findSessionByPlayerId, playerValidation, setAndSave } from './otherService';

const MAX_LENGTH = 100;

interface viewMsgReturn {
  messages: Message[]
}

function sendMessage(playerId: number, message: InputMessage): object {
  const dataStore = getData();

  // check message body
  if (!message.messageBody) {
    throw new ApiError('message too short', HttpStatusCode.BAD_REQUEST);
  }
  if (message.messageBody.length > MAX_LENGTH) {
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
    messageBody: message.messageBody,
    playerId: playerId,
    playerName: playerName,
    timeSent: getUnixTime(new Date())
  };

  matchedSession.messages.push(newMessage);
  setAndSave(dataStore);

  return {};
}

function viewMessages(playerId: number): viewMsgReturn {
  // check whether player is valid
  if (!playerValidation(playerId)) {
    throw new ApiError('player is invalid', HttpStatusCode.BAD_REQUEST);
  }

  // locate session to find playerName
  const matchedSession = findSessionByPlayerId(playerId);

  return { messages: matchedSession.messages };
}

export {
  sendMessage, viewMessages
};
