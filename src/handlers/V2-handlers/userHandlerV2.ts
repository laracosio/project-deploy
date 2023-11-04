import { Router, Request, Response } from 'express';
import { adminUserDetails } from '../../features/user';

// v2
export const userRouterV2 = Router();

// get routers
userRouterV2.get('/details', (req: Request, res: Response) => {
  const token = req.header('token');
  const response = adminUserDetails(token);
  res.send(response);
});

// post routers

// put routers

// delete routers
