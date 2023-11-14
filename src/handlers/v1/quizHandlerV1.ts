import { Router, Request, Response } from 'express';
import { adminQuizRemove, quizRemoveQuestion, adminQuizRestoreTrash, adminQuizViewTrash, adminQuizEmptyTrash } from '../../services/trashService';
import { adminQuizCreate, adminQuizInfo, adminQuizList, adminQuizNameUpdate, adminQuizDescriptionUpdate, adminQuizTransferOwner } from '../../services/quizService';
import { adminDuplicateQuestion, quizCreateQuestion, quizUpdateQuestion, adminMoveQuestion } from '../../services/questionService';
import { startNewSession } from '../../services/sessionService';

export const quizRouterV1 = Router();

// get routers
quizRouterV1.get('/list', (req: Request, res: Response) => {
  const token: string = req.query.token as string;
  res.json(adminQuizList(token));
});

quizRouterV1.get('/trash', (req: Request, res: Response) => {
  const token: string = req.query.token as string;
  res.json(adminQuizViewTrash(token));
});

quizRouterV1.get('/:quizid', (req: Request, res: Response) => {
  const token: string = req.query.token as string;
  const quizId: number = parseInt(req.params.quizid);
  res.json(adminQuizInfo(token, quizId));
});

// post routers
quizRouterV1.post('/', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  res.json(adminQuizCreate(token, name, description));
});

quizRouterV1.post('/:quizid/transfer', (req: Request, res: Response) => {
  const { token, userEmail } = req.body;
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizTransferOwner(token, quizId, userEmail));
});

quizRouterV1.post('/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token } = req.body;
  res.json(adminDuplicateQuestion(token, quizId, questionId));
});

quizRouterV1.post('/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, questionBody } = req.body;
  res.json(quizCreateQuestion(quizId, token, questionBody));
});

quizRouterV1.post('/:quizid/restore', (req: Request, res: Response) => {
  const { token } = req.body;
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizRestoreTrash(token, quizId));
});

quizRouterV1.post('/:quizid/session/start', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  res.json(startNewSession(token, quizId, req.body.autoStartNum));
});

// put routers
quizRouterV1.put('/:quizid/name', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizNameUpdate(token, quizId, req.body.name));
});

quizRouterV1.put('/:quizid/description', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizDescriptionUpdate(token, quizId, req.body.description));
});

quizRouterV1.put('/:quizid/question/:questionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token, questionBody } = req.body;
  res.json(quizUpdateQuestion(quizId, questionId, token, questionBody));
});

quizRouterV1.put('/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const token = req.body.token as string;
  const newPostion = req.body.newPosition as number;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  res.json(adminMoveQuestion(token, quizId, questionId, newPostion));
});

// delete routers
quizRouterV1.delete('/:quizid', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemove(token, quizId);
  res.json(response);
});

quizRouterV1.delete('/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = quizRemoveQuestion(token, quizId, questionId);
  res.json(response);
});

quizRouterV1.delete('/trash/empty', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizIds = req.query.quizids as string;
  const response = adminQuizEmptyTrash(token, quizIds);
  res.json(response);
});