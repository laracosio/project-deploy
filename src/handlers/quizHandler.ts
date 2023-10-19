import { adminQuizCreate } from '../features/quiz';
import { Request, Response, Router } from 'express';

export const quizRouter = Router();

quizRouter.post('/', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  res.json(adminQuizCreate(token, name, description));
});
