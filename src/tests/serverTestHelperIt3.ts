import request from 'sync-request-curl';
import { Response } from 'sync-request-curl';
import { port, url } from '../config.json';
import { QuestionCreate } from '../dataStore';

const SERVER_URL = `${url}:${port}`;

// #region auth handlers
const authUserDetailsRequestV2 = (token: string): Response => {
  return request(
    'GET',
    SERVER_URL + '/v2/admin/user/details',
    {
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};
// #endregion

// #region user handlers
// place code here and delete this message
// #endregion

// #region quiz handlers
const quizRemoveRequestV2 = (token: string, quizId: number): Response => {
  return request(
    'DELETE',
    SERVER_URL + '/v2/admin/quiz/' + quizId,
    {
      headers: {
        token: token
      }
    }
  );
};

const quizTransferRequestV2 = (token: string, quizId: number, userEmail: string): Response => {
  return request(
    'POST',
    SERVER_URL + '/v2/admin/quiz/' + quizId + '/transfer',
    {
      body: JSON.stringify({ userEmail: userEmail }),
      headers: {
        'Content-type': 'application/json',
        token: token
      },
    }
  );
};

const moveQuestionRequestV2 = (token: string, quizId: number, questionId: number, newPosition: number): Response => {
  return request(
    'PUT',
    SERVER_URL + '/v2/admin/quiz/' + quizId + '/question/' + questionId + '/move',
    {
      body: JSON.stringify({
        newPosition: newPosition,
      }),
      headers: {
        'Content-type': 'application/json',
        token: token
      },
    }
  );
};

const duplicateQuestionRequestV2 = (token: string, quizId: number, questionId: number): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`,
    {
      headers: {
        'Content-type': 'application/json',
        token: token
      },
    }
  );
};

const createQuizQuestionRequestV2 = (quizId: number, token: string, questionBody: QuestionCreate): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v2/admin/quiz/${quizId}/question`,
    {
      json: {
        questionBody: questionBody,
      },
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};

const updateQuizQuestionRequestV2 = (quizId: number, questionId: number, token: string, questionBody: QuestionCreate): Response => {
  return request(
    'PUT',
    `${SERVER_URL}/v2/admin/quiz/${quizId}/question/${questionId}`,
    {
      json: {
        questionBody: questionBody,
      },
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};

const deleteQuizQuestionRequestV2 = (sessionId: string, quizId: number, questionId: number): Response => {
  return request(
    'DELETE',
    `${SERVER_URL}/v2/admin/quiz/${quizId}/question/${questionId}`,
    {
      headers: {
        sessionId: sessionId
      }
    }
  );
};

const quizNameUpdateRequestV2 = (token: string, quizId: number, name: string): Response => {
  return request(
    'PUT',
      `${SERVER_URL}/v2/admin/quiz/${quizId}/name`,
      {
        body: JSON.stringify({
          name: name,
        }),
        headers: {
          'Content-type': 'application/json',
          token: token
        }
      }
  );
};

const quizDescriptUpdateRequestV2 = (token: string, quizId: number, description: string): Response => {
  return request(
    'PUT',
        `${SERVER_URL}/v2/admin/quiz/${quizId}/description`,
        {
          body: JSON.stringify({
            description: description,
          }),
          headers: {
            'Content-type': 'application/json',
            token: token
          }
        }
  );
};

const quizViewTrashRequestV2 = (token: string): Response => {
  return request(
    'GET',
    `${SERVER_URL}/v2/admin/quiz/trash`,
    {
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};

const quizRestoreTrashRequestV2 = (token: string, quizId: number): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v2/admin/quiz/${quizId}/restore`,
    {
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};

const quizEmptyTrashRequestV2 = (token: string, quizIds: string): Response => {
  return request(
    'DELETE',
    `${SERVER_URL}/v2/admin/quiz/trash/empty`,
    {
      qs: {
        quizIds: quizIds
      },
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};
// #endregion

// #region player handlers
// place code here and delete this message
// #endregion

export {
  authUserDetailsRequestV2, quizRemoveRequestV2, quizTransferRequestV2, moveQuestionRequestV2, duplicateQuestionRequestV2,
  createQuizQuestionRequestV2, updateQuizQuestionRequestV2, deleteQuizQuestionRequestV2, quizViewTrashRequestV2, quizRestoreTrashRequestV2,
  quizEmptyTrashRequestV2, quizNameUpdateRequestV2, quizDescriptUpdateRequestV2
};