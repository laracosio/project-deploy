import { Router, Request, Response } from 'express';
import { adminQuizRemove } from '../features/trash';

export const quizRouter = Router();

quizRouter.delete(':quizid', (req: Request, res: Response) => {
  const sessionToken = req.query.token as string;
  const quizId = parseInt(req.params.quizId);
  const response = adminQuizRemove(sessionToken, quizId);
  res.json(response);
});
