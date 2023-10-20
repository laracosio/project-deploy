import { adminQuizCreate, adminQuizInfo } from '../features/quiz';
import { Request, Response, Router } from 'express';

export const quizRouter = Router();

quizRouter.post('/', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  res.json(adminQuizCreate(token, name, description));
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


