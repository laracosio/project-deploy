import { Router, Request, Response } from 'express';
import { adminUserDetails, adminUserUpdateDetails } from '../features/user';

export const userRouter = Router();

// get routers
userRouter.get('/details', (req: Request, res: Response) => {
  const token = req.query.token.toString();
  const response = adminUserDetails(token);
  res.send(response);
});
// post routers

// put routers
userRouter.put('/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  res.json(adminUserUpdateDetails(token, email, nameFirst, nameLast));
});

// delete routers
