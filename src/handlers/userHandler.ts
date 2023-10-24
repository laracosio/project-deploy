import { Router, Request, Response } from 'express';
import { adminUserDetails, adminUserUpdatePassword } from '../features/user';

export const userRouter = Router();

// get routers
userRouter.get('/details', (req: Request, res: Response) => {
  const token = req.query.token.toString();
  const response = adminUserDetails(token);
  res.send(response);
});
// post routers

// put routers
userRouter.put('/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  res.json(adminUserUpdatePassword(token, oldPassword, newPassword));
});

// delete routers
