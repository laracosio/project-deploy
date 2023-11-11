import { Router, Request, Response } from 'express';
import { joinGuestPlayer, GuestPlayerStatus } from '../../services/playerService';

export const playerRouter = Router();

///post
playerRouter.post('/v1/player/join', (req: Request, res: Response) => {
    const { sessionId, name } = req.body;
    res.json(joinGuestPlayer(sessionId, name));
});


//get
playerRouter.get('/v1/player/:playerId', (req: Request, res: Response) => {
    const playerid = parseInt(req.params.quizid);
    res.json(GuestPlayerStatus(playerid));
});
