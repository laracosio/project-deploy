import { adminAuthRegister, adminAuthLogin, adminUserDetails} from '../features/auth';
import { Router, Request, Response  } from 'express';

export const authRouter = Router();

// authRouter.post('/', (req: Request, res: Response) => {

// });

authRouter.post('/login', (req: Request, res: Response) => {
    const {email, password} = req.body;
    res.send(adminAuthLogin(email, password));
});

authRouter.post('/details', (req: Request, res: Response) => {
    const { token } = req.body;
    res.send(adminUserDetails(token));
});