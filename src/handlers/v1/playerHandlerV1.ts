
import { Router, Request, Response } from 'express';
import { playerFinalResults, playerQuestionResults } from '../../services/playerService';

export const playerRouter = Router();

// get routers
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

// put routers

// delete routers