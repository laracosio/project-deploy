
import { Router, Request, Response } from 'express';
import { playerQuestionResult } from '../../services/playerService';

export const playerRouter = Router();

// get routers
playerRouter.get('/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
    const playerId = parseInt(req.params.playerid);
    const questionPosition = parseInt(req.params.questionposition);
    res.json(playerQuestionResult(playerId, questionPosition));
})

// post routers

// put routers

// delete routers