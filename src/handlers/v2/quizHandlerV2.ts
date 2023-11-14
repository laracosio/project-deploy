import { Router, Request, Response } from 'express';
import { adminQuizRemove, quizRemoveQuestion, adminQuizViewTrash, adminQuizRestoreTrash, adminQuizEmptyTrash } from '../../services/trashService';
import { adminQuizTransferOwner, adminQuizNameUpdate, adminQuizDescriptionUpdate, adminQuizCreate, adminQuizList, adminQuizInfo } from '../../services/quizService';
import { adminDuplicateQuestion, adminMoveQuestion, quizUpdateQuestion, quizCreateQuestion } from '../../services/questionService';

export const quizRouterV2 = Router();

// #region quiz get routers
// place code here and delete this message
// #endregion

// #region quiz post routers
quizRouterV2.post('/', (req: Request, res: Response) => {
  const token: string = req.header('token');
  const { name, description } = req.body;
  res.json(adminQuizCreate(token, name, description));
});

quizRouterV2.post('/:quizid/transfer', (req: Request, res: Response) => {
  const token = req.header('token');
  const userEmail = req.body.userEmail;
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizTransferOwner(token, quizId, userEmail));
});

quizRouterV2.post('/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.header('token');
  const { questionBody } = req.body;
  res.json(quizCreateQuestion(quizId, token, questionBody));
});

quizRouterV2.post('/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const token = req.header('token');
  res.json(adminDuplicateQuestion(token, quizId, questionId));
});

quizRouterV2.post('/:quizid/restore', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizRestoreTrash(token, quizId));
});
// #endregion

// #region quiz put routers
quizRouterV2.put('/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const token = req.header('token');
  const newPostion = req.body.newPosition as number;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  res.json(adminMoveQuestion(token, quizId, questionId, newPostion));
});
quizRouterV2.put('/:quizid/question/:questionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const token = req.header('token');
  const { questionBody } = req.body;
  res.json(quizUpdateQuestion(quizId, questionId, token, questionBody));
});

quizRouterV2.put('/:quizid/name', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizNameUpdate(token, quizId, req.body.name));
});

quizRouterV2.put('/:quizid/description', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizDescriptionUpdate(token, quizId, req.body.description));
});
// #endregion

// #region quiz delete routers
quizRouterV2.delete('/:quizid', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemove(token, quizId);
  res.json(response);
});
quizRouterV2.delete('/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  res.json(quizRemoveQuestion(token, quizId, questionId));
});

quizRouterV2.delete('/trash/empty', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizIds = req.query.quizids as string;
  const response = adminQuizEmptyTrash(token, quizIds);
  res.json(response);
});
// #endregion

// #region quiz get routers
quizRouterV2.get('/trash', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(adminQuizViewTrash(token));
});

quizRouterV2.get('/list', (req: Request, res: Response) => {
  const token: string = req.header('token');
  res.json(adminQuizList(token));
});

quizRouterV2.get('/:quizid', (req: Request, res: Response) => {
  const token: string = req.header('token');
  const quizId: number = parseInt(req.params.quizid);
  res.json(adminQuizInfo(token, quizId));
});
// #endregion
