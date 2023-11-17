import request from 'sync-request';
import { Response } from 'sync-request';
import { port, url } from '../../config.json';
import { QuestionCreate } from '../../dataStore';

const SERVER_URL = `${url}:${port}`;

// other requests
const clearRequest = (): Response => {
  return request(
    'DELETE',
    SERVER_URL + '/v1/clear'
  );
};

// #region auth requests
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

const authLogoutRequest = (token: string): Response => {
  return request(
    'POST',
    SERVER_URL + '/v1/admin/auth/logout',
    {
      json: {
        token: token,
      }
    }
  );
};
// #endregion

// #region user requests
const authUserDetailsRequest = (token: string): Response => {
  return request(
    'GET',
    SERVER_URL + '/v1/admin/user/details',
    {
      qs: {
        token: token,
      },
      headers: {
        'Content-type': 'application/json',
      }
    }
  );
};

const userUpdateDetailsRequest = (token: string, email: string, nameFirst: string, nameLast: string): Response => {
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
// #endregion

// #region quiz requests
const quizTransferRequest = (token: string, quizid: number, userEmail: string): Response => {
  return request(
    'POST',
    SERVER_URL + '/v1/admin/quiz/' + quizid + '/transfer',
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

const quizRemoveRequest = (token: string, quizid: number): Response => {
  return request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/' + quizid,
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

const quizInfoRequest = (token: string, quizid: number): Response => {
  return request(
    'GET',
          `${SERVER_URL}/v1/admin/quiz/${quizid}`,
          {
            qs: {
              token: token
            }
          }
  );
};

const quizNameUpdateRequest = (token: string, quizid: number, name: string): Response => {
  return request(
    'PUT',
      `${SERVER_URL}/v1/admin/quiz/${quizid}/name`,
      {
        body: JSON.stringify({
          token: token,
          name: name,
        }),
        headers: { 'Content-type': 'application/json' },
      }
  );
};

const quizDescriptUpdateRequest = (token: string, quizid: number, description: string): Response => {
  return request(
    'PUT',
        `${SERVER_URL}/v1/admin/quiz/${quizid}/description`,
        {
          body: JSON.stringify({
            token: token,
            description: description,
          }),
          headers: { 'Content-type': 'application/json' },
        }
  );
};

const quizViewTrashRequest = (token: string): Response => {
  return request(
    'GET',
    `${SERVER_URL}/v1/admin/quiz/trash`,
    {
      qs: {
        token: token
      },
      headers: { 'Content-type': 'application/json' },
    }
  );
};

const quizRestoreTrashRequest = (token: string, quizid: number): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v1/admin/quiz/${quizid}/restore`,
    {
      body: JSON.stringify({
        token: token,
      }),
      headers: { 'Content-type': 'application/json' },
    }
  );
};

const quizEmptyTrashRequest = (token: string, quizids: string): Response => {
  return request(
    'DELETE',
    `${SERVER_URL}/v1/admin/quiz/trash/empty`,
    {
      qs: {
        token: token,
        quizids: quizids
      },
      headers: { 'Content-type': 'application/json' },
    }
  );
};

const duplicateQuestionRequest = (token: string, quizid: number, questionid: number): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v1/admin/quiz/${quizid}/question/${questionid}/duplicate`,
    {
      body: JSON.stringify({
        token: token,
      }),
      headers: { 'Content-type': 'application/json' },
    }
  );
};

const createQuizQuestionRequest = (quizid: number, token: string, questionBody: QuestionCreate): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v1/admin/quiz/${quizid}/question`,
    {
      json: {
        token: token,
        questionBody: questionBody,
      },
    }
  );
};

const moveQuestionRequest = (token: string, quizid: number, questionid: number, newPosition: number): Response => {
  return request(
    'PUT',
    SERVER_URL + '/v1/admin/quiz/' + quizid + '/question/' + questionid + '/move',
    {
      body: JSON.stringify({
        token: token,
        newPosition: newPosition,
      }),
      headers: { 'Content-type': 'application/json' },
    }
  );
};

const updateQuizQuestionRequest = (quizid: number, questionid: number, token: string, questionBody: QuestionCreate): Response => {
  return request(
    'PUT',
    `${SERVER_URL}/v1/admin/quiz/${quizid}/question/${questionid}`,
    {
      json: {
        token: token,
        questionBody: questionBody,
      },
    }
  );
};

const deleteQuizQuestionRequest = (token: string, quizid: number, questionid: number): Response => {
  return request(
    'DELETE',
    `${SERVER_URL}/v1/admin/quiz/${quizid}/question/${questionid}`,
    {
      qs: {
        token: token
      },
    }
  );
};
// #endregion

export {
  authRegisterRequest, authLoginRequest, authUserDetailsRequest, authLogoutRequest,
  userUpdateDetailsRequest, userUpdatePasswordRequest,
  clearRequest, quizRemoveRequest, quizCreateRequest, quizListRequest,
  quizInfoRequest, quizNameUpdateRequest, quizDescriptUpdateRequest, moveQuestionRequest,
  quizTransferRequest, createQuizQuestionRequest, duplicateQuestionRequest, updateQuizQuestionRequest,
  deleteQuizQuestionRequest, quizViewTrashRequest, quizRestoreTrashRequest, quizEmptyTrashRequest
};
