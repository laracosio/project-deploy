import { Router, Request, Response } from 'express';
import { adminAuthLogout } from '../../features/auth';

export const authRouterV2 = Router();

// get Routers

// post Routers
authRouterV2.post('/logout', (req: Request, res: Response) => {
  const token: string = req.header('token');
  res.json(adminAuthLogout(token));
});

// put Routers

// delete Routers
