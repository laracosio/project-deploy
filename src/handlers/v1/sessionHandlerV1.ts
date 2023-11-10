import { Router, Request, Response } from 'express';
import { getSessionState } from '../../services/sessionService';

export const sessionRouterV1 = Router();

sessionRouterV1.get('/:quizId/session/:sessionId', (req: Request, res: Response) => {
  const quizId: number = parseInt(req.params.quizId);
  const sessionId: number = parseInt(req.params.sessionId);
  const token: string = req.header('token');
  res.json(getSessionState(quizId, sessionId, token));
});