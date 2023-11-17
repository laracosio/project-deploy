import express, { json, Request, Response, NextFunction } from 'express';
import { echo } from './echo/newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { ApiError } from './errors/ApiError';
import { authRouterV1 } from './handlers/v1/authHandlerV1';
import { quizRouterV1 } from './handlers/v1/quizHandlerV1';
import { userRouterV1 } from './handlers/v1/userHandlerV1';
import { otherRouter } from './handlers/v1/otherHandler';
import { authRouterV2 } from './handlers/v2/authHandlerV2';
import { quizRouterV2 } from './handlers/v2/quizHandlerV2';
import { sessionRouterV1 } from './handlers/v1/sessionHandlerV1';
import { userRouterV2 } from './handlers/v2/userHandlerV2';
import { Datastore, setData } from './dataStore';
import { playerRouter } from './handlers/v1/playerHandlerV1';

import { createClient } from '@vercel/kv';

// deploy
const KV_REST_API_URL = 'https://finer-glider-45574.kv.vercel-storage.com';
const KV_REST_API_TOKEN = 'AbIGASQgOTRkNzc5ZWYtZmI5MC00NDliLTkyYjUtMGUyMTZkMWFlZTBmYzUwMzYyN2MxYjlmNGRkNTk1MTZkYTIyMzQyMjZkYzQ=';

export const database = createClient({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
});

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================
app.use(express.static(__dirname + '/public'));

// deploy
app.get('/data', async (req: Request, res: Response) => {
  const data = await database.hgetall('data:project');
  res.status(200).json({ data });
});

app.put('/data', async (req: Request, res: Response) => {
  const { data } = req.body;
  await database.hset('data:project', { data });
  return res.status(200).json({});
});

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

// kept for backwards compatibility
app.use('/v1/admin/quiz', quizRouterV1);
app.use('/v1/admin/auth', authRouterV1);
app.use('/v1/admin/user', userRouterV1);
app.use('/v1/clear', otherRouter);
app.use('/v1/player', playerRouter);

app.use('/v2/admin/quiz', quizRouterV2);
app.use('/v1/admin/quiz', sessionRouterV1);
app.use('/v2/admin/auth', authRouterV2);
app.use('/v2/admin/user', userRouterV2);

app.use((err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.httpCode).json({ error: err.message });
  } else {
    res.status(404).json(err.message);
  }
});

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
  404 Not found - This could be because:
  0. You have defined routes below (not above) this middleware in server.ts
  1. You have not implemented the route ${req.method} ${req.path}
  2. There is a typo in either your test or server, e.g. /posts/list in one
  and, incorrectly, /post/list in the other
  3. You are using ts-node (instead of ts-node-dev) to start your server and
  have forgotten to manually restart to load the new changes
  4. You've forgotten a leading slash (/), e.g. you have posts/list instead
  of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, async () => {
  // Persistence - code sourced from
  // https://nw-syd-gitlab.cseunsw.tech/COMP1531/23T3/comp1531-lecturecode-23t3/-/blob/main/week3-9/src/5.1_4persistence.ts?ref_type=heads

  const promise = database.hget<Datastore>('toohak', 'datastore');
  const data = await promise;

  setData(data);

  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
