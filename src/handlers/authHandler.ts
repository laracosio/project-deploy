import { adminAuthRegister, adminAuthLogin, adminUserDetails } from '../features/auth';
import { Router, Request, Response } from 'express';

export const authRouter = Router();

// get Routers
authRouter.get('/details', (req: Request, res: Response) => {
  const token = req.query.token.toString();
  const response = adminUserDetails(token);
  res.send(response);
});

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
