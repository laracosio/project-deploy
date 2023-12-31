import { Router, Request, Response } from 'express';
import { playerFinalResults, playerQuestionResults } from '../../services/playerService';
import { joinGuestPlayer, guestPlayerStatus, sendMessage, viewMessages, currentQuestionInfo, playerSubmitAnswers } from '../../services/playerService';

export const playerRouter = Router();

// get routers
playerRouter.get('/:playerid', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  res.json(guestPlayerStatus(playerId));
});

playerRouter.get('/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  res.json(viewMessages(playerId));
});

playerRouter.get('/:playerid/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  res.json(playerFinalResults(playerId));
});

playerRouter.get('/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  res.json(viewMessages(playerId));
});

playerRouter.get('/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  res.json(playerQuestionResults(playerId, questionPosition));
});

playerRouter.get('/:playerid/question/:questionposition', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionposition = parseInt(req.params.questionposition);
  res.json(currentQuestionInfo(playerId, questionposition));
});

// post routers
playerRouter.post('/join', (req: Request, res: Response) => {
  const { sessionId, name } = req.body;
  res.json(joinGuestPlayer(sessionId, name));
});

playerRouter.post('/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const { message } = req.body;
  res.json(sendMessage(playerId, message));
});

// put routers
playerRouter.put('/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionposition = parseInt(req.params.questionposition);
  const { answerIds } = req.body;
  res.json(playerSubmitAnswers(playerId, questionposition, answerIds));
});

// delete routers
