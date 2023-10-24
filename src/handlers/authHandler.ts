import { adminAuthRegister, adminAuthLogin } from '../features/auth';
import { adminUserDetails } from '../features/user';
import { Router, Request, Response } from 'express';

export const authRouter = Router();

// get Routers

// post Routers
authRouter.post('/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);
  res.json(response);
});

authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = adminAuthLogin(email, password);
  res.json(response);
});

// put Routers

// delete Routers
