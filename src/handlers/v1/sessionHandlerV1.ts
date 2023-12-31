import { Router, Request, Response } from 'express';
import { startNewSession, getSessionStatus, viewSessions, updateSessionStatus } from '../../services/sessionService';
export const sessionRouterV1 = Router();

sessionRouterV1.get('/:quizId/sessions', (req: Request, res: Response) => {
  const token: string = req.header('token');
  const quizId: number = parseInt(req.params.quizId);
  res.json(viewSessions(token, quizId));
});

sessionRouterV1.get('/:quizId/session/:sessionId', (req: Request, res: Response) => {
  const quizId: number = parseInt(req.params.quizId);
  const sessionId: number = parseInt(req.params.sessionId);
  const token: string = req.header('token');
  res.json(getSessionStatus(quizId, sessionId, token));
});

sessionRouterV1.put('/:quizId/session/:sessionId', (req: Request, res: Response) => {
  const quizId: number = parseInt(req.params.quizId);
  const sessionId: number = parseInt(req.params.sessionId);
  const token: string = req.header('token');
  const adminAction: string = req.body.action;
  updateSessionStatus(quizId, sessionId, token, adminAction);
  res.json({});
});

sessionRouterV1.put('/:quizId/session/:sessionId', (req: Request, res: Response) => {
  const quizId: number = parseInt(req.params.quizId);
  const sessionId: number = parseInt(req.params.sessionId);
  const token: string = req.header('token');
  const adminAction: string = req.body.action;
  updateSessionStatus(quizId, sessionId, token, adminAction);
  res.json({});
});

sessionRouterV1.post('/:quizId/session/start', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizId);
  res.json(startNewSession(token, quizId, req.body.autoStartNum));
});
