import { clear } from '../features/other';
import { Router, Request, Response } from 'express';

export const otherRouter = Router();

otherRouter.delete('/', (req: Request, res:Response) => {
  res.json(clear());
});
