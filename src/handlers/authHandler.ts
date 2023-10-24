import { adminAuthRegister, adminAuthLogin, adminAuthLogout } from '../features/auth';
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

authRouter.post('/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  res.json(adminAuthLogout(token));
});

// put Routers

// delete Routers
