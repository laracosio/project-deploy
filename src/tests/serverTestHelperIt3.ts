import request from 'sync-request-curl';
import { Response } from 'sync-request-curl';
import { port, url } from '../config.json';
import { QuestionCreate, InputMessage } from '../dataStore';

const SERVER_URL = `${url}:${port}`;

export class ParsedResponse {
  response: Response;

  constructor(response: Response) {
    this.response = response;
  }

  getParsedBody() {
    if (!this.response?.body) {
      return null;
    }
    return JSON.parse(this.response.body.toString());
  }
}

export const apiGet = (url: string, headers: object): ParsedResponse => {
  const httpUrl = SERVER_URL + url;
  const httpOptions = {
    headers: {
      ...headers,
      'Content-type': 'application/json'
    }
  };
  const res = request('GET', httpUrl, httpOptions);
  const parsedResponse = new ParsedResponse(res);
  return parsedResponse;
};

export const apiPut = (url: string, body: object, headers?: object): ParsedResponse => {
  const httpUrl = SERVER_URL + url;
  const httpOptions = {
    headers: headers
      ? {
          ...headers,
          'Content-type': 'application/json'
        }
      : { 'Content-type': 'application/json' },
    body: body ? JSON.stringify(body) : null
  };
  const res = request('PUT', httpUrl, httpOptions);
  const parsedResponse = new ParsedResponse(res);
  return parsedResponse;
};

export const apiPost = (
  url: string,
  body: object,
  headers?: object
): ParsedResponse => {
  const httpUrl = SERVER_URL + url;
  const httpOptions = {
    headers: headers
      ? {
          ...headers,
          'Content-type': 'application/json'
        }
      : { 'Content-type': 'application/json' },
    body: body ? JSON.stringify(body) : null
  };
  const res: Response = request('POST', httpUrl, httpOptions);
  const parsedResponse = new ParsedResponse(res);
  return parsedResponse;
};

// #region auth handlers
const authUserDetailsRequestV2 = (token: string): Response => {
  return request('GET', SERVER_URL + '/v2/admin/user/details', {
    headers: {
      'Content-type': 'application/json',
      token: token
    }
  });
};

const authLogoutRequestV2 = (token: string): Response => {
  return request('POST', `${SERVER_URL}/v2/admin/auth/logout`, {
    headers: {
      token: token
    }
  });
};

// #endregion

// #region user handlers
const userUpdateDetailsRequestV2 = (
  token: string,
  email: string,
  nameFirst: string,
  nameLast: string
): Response => {
  return request('PUT', `${SERVER_URL}/v2/admin/user/details`, {
    body: JSON.stringify({
      email: email,
      nameFirst: nameFirst,
      nameLast: nameLast
    }),
    headers: {
      'Content-type': 'application/json',
      token: token
    }
  });
};

const userUpdatePasswordRequestV2 = (
  token: string,
  oldPassword: string,
  newPassword: string
): Response => {
  return request('PUT', SERVER_URL + '/v2/admin/user/password', {
    body: JSON.stringify({
      oldPassword: oldPassword,
      newPassword: newPassword
    }),
    headers: {
      'Content-type': 'application/json',
      token: token
    }
  });
};
// #endregion

// #region quiz handlers
const quizRemoveRequestV2 = (token: string, quizid: number): Response => {
  return request(
    'DELETE',
    SERVER_URL + '/v2/admin/quiz/' + quizid,
    {
      headers: {
        token: token
      }
    }
  );
};

const quizTransferRequestV2 = (token: string, quizid: number, userEmail: string): Response => {
  return request(
    'POST',
    SERVER_URL + '/v2/admin/quiz/' + quizid + '/transfer',
    {
      body: JSON.stringify({ userEmail: userEmail }),
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};

const moveQuestionRequestV2 = (token: string, quizid: number, questionid: number, newPosition: number): Response => {
  return request(
    'PUT',
    SERVER_URL + '/v2/admin/quiz/' + quizid + '/question/' + questionid + '/move',
    {
      body: JSON.stringify({
        newPosition: newPosition
      }),
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};

const duplicateQuestionRequestV2 = (token: string, quizid: number, questionid: number): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v2/admin/quiz/${quizid}/question/${questionid}/duplicate`,
    {
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};

const createQuizQuestionRequestV2 = (quizid: number, token: string, questionBody: QuestionCreate): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v2/admin/quiz/${quizid}/question`,
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

const updateQuizQuestionRequestV2 = (quizid: number, questionid: number, token: string, questionBody: QuestionCreate): Response => {
  return request(
    'PUT',
    `${SERVER_URL}/v2/admin/quiz/${quizid}/question/${questionid}`,
    {
      json: {
        questionBody: questionBody
      },
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};

const deleteQuizQuestionRequestV2 = (token: string, quizid: number, questionid: number): Response => {
  return request(
    'DELETE',
    `${SERVER_URL}/v2/admin/quiz/${quizid}/question/${questionid}`,
    {
      headers: {
        token: token
      }
    }
  );
};

const quizNameUpdateRequestV2 = (token: string, quizid: number, name: string): Response => {
  return request(
    'PUT',
      `${SERVER_URL}/v2/admin/quiz/${quizid}/name`,
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

const quizDescriptUpdateRequestV2 = (token: string, quizid: number, description: string): Response => {
  return request(
    'PUT',
        `${SERVER_URL}/v2/admin/quiz/${quizid}/description`,
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
  return request('GET', `${SERVER_URL}/v2/admin/quiz/trash`, {
    headers: {
      'Content-type': 'application/json',
      token: token
    }
  });
};

const quizRestoreTrashRequestV2 = (token: string, quizid: number): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v2/admin/quiz/${quizid}/restore`,
    {
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};

const quizEmptyTrashRequestV2 = (token: string, quizids: string): Response => {
  return request(
    'DELETE',
    `${SERVER_URL}/v2/admin/quiz/trash/empty`,
    {
      qs: {
        quizids: quizids
      },
      headers: {
        'Content-type': 'application/json',
        token: token
      }
    }
  );
};

const quizCreateRequestV2 = (
  token: string,
  name: string,
  description: string
): Response => {
  return request('POST', `${SERVER_URL}/v2/admin/quiz`, {
    body: JSON.stringify({
      name: name,
      description: description
    }),
    headers: {
      'Content-type': 'application/json',
      token: token
    }
  });
};

const quizListRequestV2 = (token: string): Response => {
  return request('GET', `${SERVER_URL}/v2/admin/quiz/list`, {
    headers: {
      token: token
    }
  });
};

const quizInfoRequestV2 = (token: string, quizid: number): Response => {
  return request(
    'GET',
    `${SERVER_URL}/v2/admin/quiz/${quizid}`,
    {
      headers: {
        token: token
      }
    }
  );
};

const joinGuestPlayerRequest = (sessionId: number, name: string): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v1/player/join`,
    {
      body: JSON.stringify({
        sessionId: sessionId,
        name: name,
      }),
      headers: {
        'Content-type': 'application/json'
      },
    }
  );
};

const guestPlayerStatusRequest = (playerid: number): Response => {
  return request(
    'GET',
    `${SERVER_URL}/v1/player/${playerid}`,
    {
      headers: {
        'Content-type': 'application/json'
      },
    }
  );
};

const quizFinalResultsRequest = (quizid: number, sessionid: number, token: string): Response => {
  console.log(`helper ${quizid}, ${sessionid}, ${token}`);
  return request(
    'GET',
    `${SERVER_URL}/v1/admin/quiz/${quizid}/session/${sessionid}/results`,
    {
      headers: {
        token: token
      }
    }
  );
};

const quizFinalResultsCSVRequest = (quizid: number, sessionid: number, token: string): Response => {
  return request(
    'GET',
    `${SERVER_URL}/v1/admin/quiz/${quizid}/session/${sessionid}/results/csv`,
    {
      headers: {
        token: token
      }
    }
  );
};
// #endregion

// #region player handlers
const sendMsgRequest = (playerId: number, message: InputMessage): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v1/player/${playerId}/chat`,
    {
      body: JSON.stringify({
        message: message
      }),
      headers: {
        'Content-type': 'application/json'
      }
    }
  );
};

const viewMsgsRequest = (playerId: number): Response => {
  return request(
    'GET',
    `${SERVER_URL}/v1/player/${playerId}/chat`
  );
};
// #endregion

// #region session handlers
const sessionCreateRequest = (token: string, quizId: number, autoStartNum: number): Response => {
  return request(
    'POST',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/session/start`,
    {
      body: JSON.stringify({
        autoStartNum: autoStartNum,
      }),
      headers: {
        'Content-type': 'application/json',
        token: token
      },
    }
  );
};
// #endregion

export {
  authUserDetailsRequestV2, quizRemoveRequestV2, quizTransferRequestV2, moveQuestionRequestV2, duplicateQuestionRequestV2,
  createQuizQuestionRequestV2, updateQuizQuestionRequestV2, deleteQuizQuestionRequestV2, quizViewTrashRequestV2, quizRestoreTrashRequestV2,
  quizEmptyTrashRequestV2, quizNameUpdateRequestV2, quizDescriptUpdateRequestV2, quizCreateRequestV2, quizListRequestV2,
  quizInfoRequestV2, authLogoutRequestV2, userUpdateDetailsRequestV2, userUpdatePasswordRequestV2, quizFinalResultsRequest,
  quizFinalResultsCSVRequest, sendMsgRequest,
  viewMsgsRequest, sessionCreateRequest, joinGuestPlayerRequest, guestPlayerStatusRequest
};
