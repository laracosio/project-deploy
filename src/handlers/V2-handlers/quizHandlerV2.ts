import { Router, Request, Response } from 'express';
import { adminQuizRemove } from '../../features/trash';

export const quizRouterV2 = Router();

// #region quiz get routers
// place code here and delete this message
// #endregion

// #region quiz post routers
// place code here and delete this message
// #endregion

// #region quiz put routers
// place code here and delete this message
// #endregion

// #region quiz delete routers
quizRouterV2.delete('/:quizid', (req: Request, res: Response) => {
    const userToken = req.header('token');
    const quizId = parseInt(req.params.quizid);
    const response = adminQuizRemove(userToken, quizId);
    res.json(response);
});
// #endregion
