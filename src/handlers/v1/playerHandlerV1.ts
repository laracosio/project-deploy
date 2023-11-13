import { Router, Request, Response } from 'express';
import { playerFinalResults, playerQuestionResults } from '../../services/playerService';
import { joinGuestPlayer, GuestPlayerStatus } from '../../services/playerService';

export const playerRouter = Router();

// get routers
playerRouter.get('/:playerid', (req: Request, res: Response) => {
    const playerid = parseInt(req.params.playerid);
    res.json(GuestPlayerStatus(playerid));
});

playerRouter.get('/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
    const playerId = parseInt(req.params.playerid);
    const questionPosition = parseInt(req.params.questionposition);
    res.json(playerQuestionResults(playerId, questionPosition));
})

playerRouter.get('/:playerid/results', (req: Request, res: Response) => {
    const playerId = parseInt(req.params.playerid);
    res.json(playerFinalResults(playerId));
})

// post routers
playerRouter.post('/join', (req: Request, res: Response) => {
    console.log('Entered server');
    const { sessionId, name } = req.body;
    res.json(joinGuestPlayer(sessionId, name));
  });
// put routers

// delete routers
