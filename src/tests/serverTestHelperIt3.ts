import request from 'sync-request-curl';
import { Response } from 'sync-request-curl';
import { port, url } from '../config.json';
import { QuestionCreate, InputMessage } from '../dataStore';

export const SERVER_URL = `${url}:${port}`;

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

export const apiPut = (url: string, body: object, headers: object): ParsedResponse => {
  const httpUrl = SERVER_URL + url;
  const httpOptions = {
    headers: headers
      ? {
          ...headers,
          'Content-type': 'application/json'
        }
      : null,
    body: body ? JSON.stringify(body) : null
  };
  const res = request('PUT', httpUrl, httpOptions);
  const parsedResponse = new ParsedResponse(res);
  return parsedResponse;
};

export const apiPost = (
  url: string,
  body: object,
  headers: object
): ParsedResponse => {
  const httpUrl = SERVER_URL + url;
  const httpOptions = {
    headers: headers
      ? {
          ...headers,
          'Content-type': 'application/json'
        }
      : null,
    body: body ? JSON.stringify(body) : null
  };
  const res: Response = request('POST', httpUrl, httpOptions);
  const parsedResponse = new ParsedResponse(res);
  return parsedResponse;
};

// #region auth handlers
export const authUserDetailsRequestV2 = (token: string): Response => {
  return request('GET', SERVER_URL + '/v2/admin/user/details', {
    headers: {
      'Content-type': 'application/json',
      token: token
    }
  });
};

export const authLogoutRequestV2 = (token: string): Response => {
  return request('POST', `${SERVER_URL}/v2/admin/auth/logout`, {
    headers: {
      token: token
    }
  });
};

// #endregion

// #region user handlers
export const userUpdateDetailsRequestV2 = (
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

export const userUpdatePasswordRequestV2 = (
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
export const quizRemoveRequestV2 = (token: string, quizid: number): Response => {
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

export const quizTransferRequestV2 = (token: string, quizid: number, userEmail: string): Response => {
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

export const moveQuestionRequestV2 = (token: string, quizid: number, questionid: number, newPosition: number): Response => {
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

export const duplicateQuestionRequestV2 = (token: string, quizid: number, questionid: number): Response => {
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

export const createQuizQuestionRequestV2 = (quizid: number, token: string, questionBody: QuestionCreate): Response => {
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

export const updateQuizQuestionRequestV2 = (quizid: number, questionid: number, token: string, questionBody: QuestionCreate): Response => {
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

export const deleteQuizQuestionRequestV2 = (token: string, quizid: number, questionid: number): Response => {
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

export const quizNameUpdateRequestV2 = (token: string, quizid: number, name: string): Response => {
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

export const quizDescriptUpdateRequestV2 = (token: string, quizid: number, description: string): Response => {
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

export const quizViewTrashRequestV2 = (token: string): Response => {
  return request('GET', `${SERVER_URL}/v2/admin/quiz/trash`, {
    headers: {
      'Content-type': 'application/json',
      token: token
    }
  });
};

export const quizRestoreTrashRequestV2 = (token: string, quizid: number): Response => {
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

export const quizEmptyTrashRequestV2 = (token: string, quizids: string): Response => {
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

export const quizCreateRequestV2 = (
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

export const quizListRequestV2 = (token: string): Response => {
  return request('GET', `${SERVER_URL}/v2/admin/quiz/list`, {
    headers: {
      token: token
    }
  });
};

export const quizInfoRequestV2 = (token: string, quizid: number): Response => {
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

export const joinGuestPlayerRequest = (sessionId: number, name: string): Response => {
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

export const guestPlayerStatusRequest = (playerid: number): Response => {
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

export const quizThumbnailUpdateRequest = (token: string, quizid: number, imgUrl: string): Response => {
  return request(
    'PUT',
    `${SERVER_URL}/v1/admin/quiz/${quizid}/thumbnail`,
    {
      body: JSON.stringify({
        imgUrl: imgUrl,
      }),
      headers: {
        'Content-type': 'application/json',
        token: token
      },
    }
  );
};
// #endregion

// #region player handlers
export const sendMsgRequest = (playerId: number, message: InputMessage): Response => {
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

export const viewMsgsRequest = (playerId: number): Response => {
  return request(
    'GET',
    `${SERVER_URL}/v1/player/${playerId}/chat`
  );
};
// #endregion

// #region session handlers
export const sessionCreateRequest = (token: string, quizId: number, autoStartNum: number): Response => {
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

export const updateSessionRequest = (token: string, quizId: number, sessionId: number, action: string): Response => {
  return request(
    'PUT',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/session/${sessionId}`,
    {
      body: JSON.stringify({
        action: action,
      }),
      headers: {
        'Content-type': 'application/json',
        token: token
      },
    }
  );
};

export const sessionStatusRequest = (token: string, quizId: number, sessionId: number): Response => {
  return request(
    'GET',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/session/${sessionId}`,
    {
      headers: {
        'Content-type': 'application/json',
        token: token
      },
    }
  );
};
// #endregion

export const viewSessionsRequest = (token: string, quizid: number): Response => {
  return request(
    'GET',
    `${SERVER_URL}/v1/admin/quiz/${quizid}/sessions`,
    {
      headers: {
        'Content-type': 'application/json',
        token: token
      },
    }
  );
};
