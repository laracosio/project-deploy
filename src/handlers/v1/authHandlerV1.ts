import { adminAuthRegister, adminAuthLogin, adminAuthLogout } from '../../services/authService';
import { Router, Request, Response } from 'express';

export const authRouterV1 = Router();

// get Routers

// post Routers
authRouterV1.post('/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);
  res.json(response);
});

authRouterV1.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = adminAuthLogin(email, password);
  res.json(response);
});

authRouterV1.post('/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  res.json(adminAuthLogout(token));
});

// put Routers

// delete Routers
