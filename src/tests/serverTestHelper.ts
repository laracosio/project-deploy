import request from 'sync-request-curl';
import { port, url } from '../config.json'

const SERVER_URL = `${url}:${port}`;

interface SessionReturn {
  token: string
}

const authRegisterRequest = (email: string, password: string, nameFirst: string, nameLast: string): SessionReturn => {
  const response = request('POST', `${SERVER_URL}/v1/auth/register`, { json: { email: email, password: password, nameFirst: nameFirst, nameLast: nameLast } });
  return JSON.parse(response.body.toString());
}

export { authRegisterRequest, };