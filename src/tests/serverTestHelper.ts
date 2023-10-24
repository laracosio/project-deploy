import request from 'sync-request-curl';
import { Response } from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

// other requests
const clearRequest = (): Response => {
  return request(
    'DELETE',
    SERVER_URL + '/v1/clear'
  );
};

// auth requests
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
    SERVER_URL + '/v1/admin/user/details',
    {
      qs: {
        token: token,
      }
    }
  );
};


// quiz requests
// must go before create!
const quizTransferRequest = (token: string, quizId: number, userEmail: string): Response => {
  return request(
    'POST',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/transfer',
    {
      body: JSON.stringify({
        token: token,
        userEmail: userEmail
      }),
      headers: { 'Content-type': 'application/json' },
    }
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

const quizRemoveRequest = (token: string, quizId: number): Response => {
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

const quizInfoRequest = (token: string, quizId: number): Response => {
  return request(
    'GET',
    `${SERVER_URL}/v1/admin/quiz/${quizId}`,
    {
      qs: {
        token: token
      }
    }
  );
};

const quizNameUpdateRequest = (token: string, quizId: number, name: string): Response => {
  return request(
    'PUT',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/name`,
    {
      body: JSON.stringify({
        token: token,
        name: name,
      }),
      headers: { 'Content-type': 'application/json' },
    }
  );
};

const quizDescriptUpdateRequest = (token: string, quizId: number, description: string): Response => {
  return request(
    'PUT',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/description`,
    {
      body: JSON.stringify({
        token: token,
        description: description,
      }),
      headers: { 'Content-type': 'application/json' },
    }
  );
};

export {
  authRegisterRequest, authLoginRequest, authUserDetailsRequest, clearRequest,
  quizRemoveRequest, quizCreateRequest, quizListRequest, quizInfoRequest,
  quizNameUpdateRequest, quizDescriptUpdateRequest, quizTransferRequest
};
