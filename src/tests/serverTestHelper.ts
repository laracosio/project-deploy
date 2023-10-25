import request from 'sync-request-curl';
import { Response } from 'sync-request-curl';
import { port, url } from '../config.json';
import { QuestionCreate } from '../dataStore';

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

// user requests
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

const userUpdateDetailsResponse = (token: string, email: string, nameFirst: string, nameLast: string): Response => {
  return request(
    'PUT',
    `${SERVER_URL}/v1/admin/user/details`,
    {
      body: JSON.stringify({
        token: token,
        email: email,
        nameFirst: nameFirst,
        nameLast: nameLast
      }),
      headers: { 'Content-type': 'application/json' },
    }
  );
};

// user requests
const userUpdatePasswordRequest = (token: string, oldPassword: string, newPassword: string): Response => {
  return request(
    'PUT',
    SERVER_URL + '/v1/admin/user/password',
    {
      body: JSON.stringify({
        token: token,
        oldPassword: oldPassword,
        newPassword: newPassword
      }),
      headers: { 'Content-type': 'application/json' },
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

// question requests
const duplicateQuestionRequest = (token: string, quizId: number, questionId: number): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`,
    {
      body: JSON.stringify({
        token: token,
      }),
      headers: { 'Content-type': 'application/json' },
    }
  );
};

const createQuizQuestionRequest = (quizId: number, token: string, questionBody: QuestionCreate): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/question`,
    {
      json: {
        token: token,
        questionBody: questionBody,
      },
    }
  );
};

const moveQuestionRequest = (token: string, quizId: number, questionId: number, newPosition: number): Response => {
  return request(
    'PUT',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/question/' + questionId + '/move',
    {
      body: JSON.stringify({
        token: token,
        newPosition: newPosition,
      }),
      headers: { 'Content-type': 'application/json' },
    }
  );
};

const updateQuizQuestionRequest = (quizId: number, questionId: number, token: string, questionBody: QuestionCreate): Response => {
  return request(
    'PUT',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/question/${questionId}`,
    {
      json: {
        token: token,
        questionBody: questionBody,
      },
    }
  );
};
const deleteQuizQuestionRequest = (sessionId: string, quizId: number, questionId: number): Response => {
  return request(
    'DELETE',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/question/${questionId}`,
    {
      qs: {
        sessionId: sessionId
      },
    }
  );
};

export {
  authRegisterRequest, authLoginRequest, authUserDetailsRequest, userUpdateDetailsResponse,
  userUpdatePasswordRequest,
  clearRequest, quizRemoveRequest, quizCreateRequest, quizListRequest,
  quizInfoRequest, quizNameUpdateRequest, quizDescriptUpdateRequest, moveQuestionRequest,
  quizTransferRequest, createQuizQuestionRequest, duplicateQuestionRequest, updateQuizQuestionRequest,
  deleteQuizQuestionRequest
};
