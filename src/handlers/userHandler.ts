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
userRouter.get('/password', (req: Request, res: Response) => {
  const token = req.query.token.toString();
  res.json(adminUserUpdatePassword(token, req.body.oldPassword, req.body.newPassword));
})

// delete routers
