import { Router, Request, Response } from 'express';
import { adminQuizRemove, quizRemoveQuestion, adminQuizRestoreTrash, adminQuizViewTrash, adminQuizEmptyTrash } from '../../services/trashService';
import { adminQuizCreate, adminQuizInfo, adminQuizList, adminQuizNameUpdate, adminQuizDescriptionUpdate, adminQuizTransferOwner } from '../../services/quizService';
import { adminDuplicateQuestion, quizCreateQuestion, quizUpdateQuestion, adminMoveQuestion } from '../../services/questionService';
import { quizThumbnailUpdate } from '../../services/thumbnailService';

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

quizRouterV1.get('/:quizId', (req: Request, res: Response) => {
  const token: string = req.query.token as string;
  const quizId: number = parseInt(req.params.quizId);
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

quizRouterV1.post('/:quizId/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const { token, questionBody } = req.body;
  res.json(quizCreateQuestion(quizId, token, questionBody));
});

quizRouterV1.post('/:quizId/restore', (req: Request, res: Response) => {
  const { token } = req.body;
  const quizId = parseInt(req.params.quizId);
  res.json(adminQuizRestoreTrash(token, quizId));
});

// put routers
quizRouterV1.put('/:quizId/name', (req: Request, res: Response) => {
  const sessionToken = req.body.token as string;
  const quizId = parseInt(req.params.quizId);
  res.json(adminQuizNameUpdate(sessionToken, quizId, req.body.name));
});

quizRouterV1.put('/:quizId/description', (req: Request, res: Response) => {
  const sessionToken = req.body.token as string;
  const quizId = parseInt(req.params.quizId);
  res.json(adminQuizDescriptionUpdate(sessionToken, quizId, req.body.description));
});

quizRouterV1.put('/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const { token, questionBody } = req.body;
  res.json(quizUpdateQuestion(quizId, questionId, token, questionBody));
});

quizRouterV1.put('/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const sessionToken = req.body.token as string;
  const newPostion = req.body.newPosition as number;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  res.json(adminMoveQuestion(sessionToken, quizId, questionId, newPostion));
});

quizRouterV1.put('/:quizId/thumbnail', (req: Request, res: Response) => {
  const sessionToken = req.body.token as string;
  const quizId = parseInt(req.params.quizId);
  res.json(quizThumbnailUpdate(sessionToken, quizId, req.body.imgUrl));
});

// delete routers
quizRouterV1.delete('/:quizid', (req: Request, res: Response) => {
  const sessionToken = req.query.token as string;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemove(sessionToken, quizId);
  res.json(response);
});

quizRouterV1.delete('/:quizid/question/:questionId', (req: Request, res: Response) => {
  const sessionToken = req.query.sessionId as string;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionId);
  const response = quizRemoveQuestion(sessionToken, quizId, questionId);
  res.json(response);
});

quizRouterV1.delete('/trash/empty', (req: Request, res: Response) => {
  const sessionToken = req.query.token as string;
  const quizIds = req.query.quizIds as string;
  const response = adminQuizEmptyTrash(sessionToken, quizIds);
  res.json(response);
});
