import request from 'sync-request-curl';
import { Response } from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

const authRegisterRequest = (email: string, password: string, nameFirst: string, nameLast: string): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v1/admin/auth/register`,
    {
      json:
      {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast
      }
    }
  );
};

const authLoginRequest = (email: string, password: string): Response => {
  return request(
    'POST',
    SERVER_URL + '/v1/admin/auth/login',
    {
      json: {
        email: email,
        password: password,
      }
    }
  );
};

const authUserDetailsRequest = (token: string): Response => {
  return request(
    'GET',
    SERVER_URL + '/v1/admin/auth/details',
    {
      qs: {
        token: token,
      }
    }
  );
};

const clearRequest = (): Response => {
  return request(
    'DELETE',
    SERVER_URL + '/v1/clear'
  );
};

const quizCreateRequest = (token: string, name: string, description: string): Response => {
  return request(
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
};

const quizRemoveRequest = (quizId: number, token: string): Response => {
  return request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/' + quizId,
    {
      qs: {
        token: token
      }
    }
  );
};

const quizListRequest = (token: string): Response => {
  return request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/list',
    {
      qs: {
        token: token
      }
    }
  );
};

const quizInfoRequest = (quizId: number, token: string): Response => {
  return request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/list',
    {
      qs: {
        quizId: quizId,
        token: token
      }
    }
  );
};

const quizNameUpdateRequest = (quizId: number, token: string, name: string): Response => {
  return request(
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
};

const quizDescriptUpdateRequest = (quizId: number, token: string, description: string): Response => {
  return request(
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
};

export { authRegisterRequest, authLoginRequest, authUserDetailsRequest, clearRequest, quizRemoveRequest, quizCreateRequest, quizListRequest, quizInfoRequest, quizNameUpdateRequest, quizDescriptUpdateRequest };