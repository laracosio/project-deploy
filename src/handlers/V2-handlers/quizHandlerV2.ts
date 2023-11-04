import { Router, Request, Response } from 'express';
import { adminQuizRemove, quizRemoveQuestion } from '../../features/trash';
import { adminQuizTransferOwner } from '../../features/quiz';
import { adminDuplicateQuestion, adminMoveQuestion, quizUpdateQuestion, quizCreateQuestion } from '../../features/question';

export const quizRouterV2 = Router();

// #region quiz get routers
// place code here and delete this message
// #endregion

// #region quiz post routers
quizRouterV2.post('/:quizid/transfer', (req: Request, res: Response) => {
  const token = req.header('token');
  const userEmail = req.body.userEmail;
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizTransferOwner(token, quizId, userEmail));
});

quizRouterV2.post('/:quizId/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
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
// #endregion

// #region quiz put routers
quizRouterV2.put('/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const token = req.header('token');
  const newPostion = req.body.newPosition as number;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  res.json(adminMoveQuestion(token, quizId, questionId, newPostion));
});
quizRouterV2.put('/:quizId/question/:questionId', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizId);
  const questionId = parseInt(req.params.questionId);
  const token = req.header('token');
  const { questionBody } = req.body;
  res.json(quizUpdateQuestion(quizId, questionId, token, questionBody));
});
// #endregion

// #region quiz delete routers
quizRouterV2.delete('/:quizid', (req: Request, res: Response) => {
  const token = req.header('token');
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemove(token, quizId);
  res.json(response);
});
quizRouterV2.delete('/:quizid/question/:questionId', (req: Request, res: Response) => {
  const sessionToken = req.header('sessionToken');
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionId);
  res.json(quizRemoveQuestion(sessionToken, quizId, questionId));
});
// #endregion
