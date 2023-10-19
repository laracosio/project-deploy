import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

const authRegisterRequest = (email: string, password: string, nameFirst: string, nameLast: string): object => {
  const response = request('POST',
    `${SERVER_URL}/v1/auth/register`,
    { json: { email: email, password: password, nameFirst: nameFirst, nameLast: nameLast } });
  return JSON.parse(response.body.toString());
};

const authLoginRequest = (email: string, password: string): object => {
  const response = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/login',
    {
      json: {
        email: email,
        password: password,
      }
    }
  );
  return JSON.parse(response.body.toString());
};

const authUserDetailsRequest = (token: string) => {
  const response = request(
    'GET',
    SERVER_URL + '/v1/admin/auth/details',
    {
      qs: {
        token: token,
      }
    }
  );
  return JSON.parse(response.body.toString());
};

const clearRequest = (): object => {
  const response = request(
    'DELETE',
    SERVER_URL + '/v1/clear'
  );
  return JSON.parse(response.body.toString());
};

const quizCreateRequest = (token: string, name: string, description: string): object => {
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
};

const quizRemoveRequest = (quizId: number, token: string) => {
  const response = request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/' + quizId,
    {
      qs: {
        token: token
      }
    }
  );
  return JSON.parse(response.body.toString());
};

const quizListRequest = (token: string) => {
  const response = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/list',
    {
      qs: {
        token: token
      }
    }
  );
  return JSON.parse(response.body.toString());
};

const quizInfoRequest = (quizId: number, token: string) => {
  const response = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/list',
    {
      qs: {
        quizId: quizId,
        token: token
      }
    }
  );
  return JSON.parse(response.body.toString());
};

const quizNameUpdateRequest = (quizId: number, token: string, name: string) => {
  const response = request(
    'PUT',
    SERVER_URL + '/v1/admin/' + quizId + '/name',
    {
      body: JSON.stringify({
        token: token,
        name: name,
      }),
      headers: { 'Content-type': 'application/json' },
    }
  );
  return JSON.parse(response.body.toString());
};

const quizDescriptUpdateRequest = (quizId: number, token: string, description: string) => {
  const response = request(
    'PUT',
    SERVER_URL + '/v1/admin/' + quizId + '/name',
    {
      body: JSON.stringify({
        token: token,
        description: description,
      }),
      headers: { 'Content-type': 'application/json' },
    }
  );
  return JSON.parse(response.body.toString());
};

export { authRegisterRequest, authLoginRequest, authUserDetailsRequest, clearRequest, quizRemoveRequest, quizCreateRequest, quizListRequest, quizInfoRequest, quizNameUpdateRequest, quizDescriptUpdateRequest };
