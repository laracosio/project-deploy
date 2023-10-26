import { Router, Request, Response } from 'express';
import { adminQuizRemove, adminQuizRestoreTrash, adminQuizViewTrash} from '../features/trash';
import { adminQuizCreate, adminQuizInfo, adminQuizList, adminQuizNameUpdate, adminQuizDescriptionUpdate, adminQuizTransferOwner } from '../features/quiz';
import { quizCreateQuestion } from '../features/question';
export const quizRouter = Router();

// get routers
quizRouter.get('/list', (req: Request, res: Response) => {
  const token: string = req.query.token as string;
  res.json(adminQuizList(token));
});


quizRouter.get('/trash', (req: Request, res: Response) => {
  const token: string = req.query.token as string;
  res.json(adminQuizViewTrash(token));
});

quizRouter.get('/:quizId', (req: Request, res: Response) => {
  const token: string = req.query.token as string;
  const quizId: number = parseInt(req.params.quizId);
  res.json(adminQuizInfo(token, quizId));
});

// post routers - quizCreate must go last!
quizRouter.post('/:quizid/transfer', (req: Request, res: Response) => {
  const { token, userEmail } = req.body;
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizTransferOwner(token, quizId, userEmail));
});

quizRouter.post('/:quizId/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const { token, questionBody } = req.body;
  res.json(quizCreateQuestion(quizId, token, questionBody));
});

quizRouter.post('/:quizId/restore', (req: Request, res: Response) => {
  const { token } = req.body;
  const quizId = parseInt(req.params.quizId);
  res.json(adminQuizRestoreTrash(token, quizId));
});

quizRouter.post('/', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  res.json(adminQuizCreate(token, name, description));
});


// put routers
quizRouter.put('/:quizId/name', (req: Request, res: Response) => {
  const sessionToken = req.body.token as string;
  const quizId = parseInt(req.params.quizId);
  res.json(adminQuizNameUpdate(sessionToken, quizId, req.body.name));
});

quizRouter.put('/:quizId/description', (req: Request, res: Response) => {
  const sessionToken = req.body.token as string;
  const quizId = parseInt(req.params.quizId);
  res.json(adminQuizDescriptionUpdate(sessionToken, quizId, req.body.description));
});

// delete routers
quizRouter.delete('/:quizid', (req: Request, res: Response) => {
  const sessionToken = req.query.token as string;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemove(sessionToken, quizId);
  res.json(response);
});
