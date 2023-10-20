import { Router, Request, Response } from 'express';
import { adminQuizRemove } from '../features/trash';
import { adminQuizCreate, adminQuizInfo } from '../features/quiz';

export const quizRouter = Router();

quizRouter.post('/', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  res.json(adminQuizCreate(token, name, description));
});

quizRouter.delete('/:quizid', (req: Request, res: Response) => {
  const sessionToken = req.query.token as string;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemove(sessionToken, quizId);
  res.json(response);
});


const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
// const Article = require('./models').Article;

quizRouter.get('/:quizId', (req: Request, res: Response) => {
  const token: string = req.query.token as string
  const quizId: number = parseInt(req.params.quizId);
  res.json(adminQuizInfo(token, quizId));
});


