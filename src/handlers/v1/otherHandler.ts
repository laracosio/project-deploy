import { clear } from '../../services/otherService';
import { Router, Request, Response } from 'express';

export const otherRouter = Router();

// get routers

// post routers

// put routers

// delete routers
otherRouter.delete('/', (req: Request, res:Response) => {
  res.json(clear());
});
