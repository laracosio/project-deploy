import { Router, Request, Response } from 'express';
import { adminQuizRemove, quizRemoveQuestion, adminQuizRestoreTrash, adminQuizViewTrash } from '../features/trash';
import { adminQuizCreate, adminQuizInfo, adminQuizList, adminQuizNameUpdate, adminQuizDescriptionUpdate, adminQuizTransferOwner } from '../features/quiz';
import { adminDuplicateQuestion, quizCreateQuestion, quizUpdateQuestion, adminMoveQuestion } from '../features/question';

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

// post routers
quizRouter.post('/', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  res.json(adminQuizCreate(token, name, description));
});

quizRouter.post('/:quizid/transfer', (req: Request, res: Response) => {
  const { token, userEmail } = req.body;
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizTransferOwner(token, quizId, userEmail));
});

quizRouter.post('/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token } = req.body;
  res.json(adminDuplicateQuestion(token, quizId, questionId));
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

quizRouter.put('/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const { token, questionBody } = req.body;
  res.json(quizUpdateQuestion(quizId, questionId, token, questionBody));
});

quizRouter.put('/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const sessionToken = req.body.token as string;
  const newPostion = req.body.newPosition as number;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  res.json(adminMoveQuestion(sessionToken, quizId, questionId, newPostion));
});

// delete routers
quizRouter.delete('/:quizid', (req: Request, res: Response) => {
  const sessionToken = req.query.token as string;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemove(sessionToken, quizId);
  res.json(response);
});

quizRouter.delete('/:quizid/question/:questionId', (req: Request, res: Response) => {
  const sessionToken = req.query.sessionId as string;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionId);
  const response = quizRemoveQuestion(sessionToken, quizId, questionId);
  res.json(response);
});

