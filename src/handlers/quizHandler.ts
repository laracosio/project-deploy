import { Router, Request, Response } from 'express';
import { adminQuizRemove, adminQuizRestoreTrash, adminQuizViewTrash } from '../features/trash';
import { adminQuizCreate, adminQuizInfo, adminQuizList, adminQuizNameUpdate, adminQuizDescriptionUpdate } from '../features/quiz';
import { quizCreateQuestion } from '../features/question';
export const quizRouter = Router();

// get routers
quizRouter.get('/list', (req: Request, res: Response) => {
  const token: string = req.query.token as string;
  res.json(adminQuizList(token));
});

quizRouter.get('/:quizId', (req: Request, res: Response) => {
  const token: string = req.query.token as string;
  const quizId: number = parseInt(req.params.quizId);
  res.json(adminQuizInfo(token, quizId));
});

quizRouter.get('/trash', (req: Request, res: Response) => {
  const token: string = req.query.token as string;
  res.json(adminQuizViewTrash(token));
});

// post routers - quizCreate must go last!
quizRouter.post('/', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  res.json(adminQuizCreate(token, name, description));
});

quizRouter.post('/:quizId/restore', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const quizId: number = parseInt(req.params.quizId);
  res.json(adminQuizRestoreTrash(token, quizId));
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

//
quizRouter.post('/:quizId/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const { token, questionBody } = req.body;
  res.json(quizCreateQuestion(quizId, token, questionBody));
});
