import { Router, Request, Response } from 'express';
import { adminUserDetails, adminUserUpdateDetails, adminUserUpdatePassword } from '../../services/userService';

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
userRouterV2.put('/details', (req: Request, res: Response) => {
  const token = req.header('token');
  const { email, nameFirst, nameLast } = req.body;
  res.json(adminUserUpdateDetails(token, email, nameFirst, nameLast));
});

userRouterV2.put('/password', (req: Request, res: Response) => {
  const token = req.header('token');
  const { oldPassword, newPassword } = req.body;
  res.json(adminUserUpdatePassword(token, oldPassword, newPassword));
});

// delete routers
