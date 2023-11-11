import { Router, Request, Response } from 'express';
import { sendMessage, viewMessages } from '../../services/playerService';

export const playerRouter = Router();

// get routers
playerRouter.get('/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  res.json(viewMessages(playerId));
});

// post routers
playerRouter.post('/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const { message } = req.body;
  res.json(sendMessage(playerId, message));
});

// put routers

// delete routers
