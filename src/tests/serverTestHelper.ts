import request from 'sync-request-curl';
import { port, url } from '../config.json'

const SERVER_URL = `${url}:${port}`;

interface SessionReturn {
  token: string
}

const authRegisterRequest = (email: string, password: string, nameFirst: string, nameLast: string): SessionReturn => {
  const response = request('POST',
    `${SERVER_URL}/v1/auth/register`, 
    { json: { email: email, password: password, nameFirst: nameFirst, nameLast: nameLast } });
  return JSON.parse(response.body.toString());
}

const clearRequest = (): SessionReturn => {
  const response = request(
    'DELETE',
    SERVER_URL + '/v1/clear'
  );
  return JSON.parse(response.body.toString());
}

const quizCreateRequest = (token: string, name: string, description: string): SessionReturn => {
  const response = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz',
    {
      body: JSON.stringify({
        token: token,
        name: name,
        description: description
      }),
      headers: { 'Content-type': 'application/json' },
    }
  );
  return JSON.parse(response.body.toString());
}

const quizRemoveRequest = (quizId: number, token: string) => {
  const response = request(
    'DELETE',
    SERVER_URL + '/v1/admin//quiz/' + quizId,
    {
      qs: {
        token: token
      }
    }
  );
  return JSON.parse(response.body.toString());
}

export { authRegisterRequest, clearRequest, quizRemoveRequest, quizCreateRequest };