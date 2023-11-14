import { Router, Request, Response } from 'express';
import { adminUserDetails, adminUserUpdateDetails, adminUserUpdatePassword } from '../../services/userService';

export const userRouterV1 = Router();

// get routers
userRouterV1.get('/details', (req: Request, res: Response) => {
  const token = req.query.token.toString();
  const response = adminUserDetails(token);
  res.send(response);
});

// post routers

// put routers
userRouterV1.put('/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  res.json(adminUserUpdateDetails(token, email, nameFirst, nameLast));
});

userRouterV1.put('/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  res.json(adminUserUpdatePassword(token, oldPassword, newPassword));
});

// delete routers
