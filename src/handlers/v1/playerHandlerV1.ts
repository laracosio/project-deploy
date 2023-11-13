import { Router, Request, Response } from 'express';
import { joinGuestPlayer, GuestPlayerStatus } from '../../services/playerService';

export const playerRouter = Router();

/// post
playerRouter.post('/join', (req: Request, res: Response) => {
  console.log('Entered server');
  const { sessionId, name } = req.body;
  res.json(joinGuestPlayer(sessionId, name));
});

// get
playerRouter.get('/:playerId', (req: Request, res: Response) => {
  const playerid = parseInt(req.params.playerId);
  res.json(GuestPlayerStatus(playerid));
});
