import { Router, Request, Response } from 'express';
import { startNewSession } from '../../services/sessionService';
import { quizRouterV1 } from './quizHandlerV1';

export const sessionRouterV1 = Router();

quizRouterV1.post('/:quizId/session/start', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizId);
  res.json(startNewSession(token, quizId, req.body.autoStartNum));
});
