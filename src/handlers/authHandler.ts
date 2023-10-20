import { adminAuthRegister } from '../features/auth';
import { Router, Request, Response } from 'express';

export const authRouter = Router();

authRouter.post('/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);
  res.json(response);
});
