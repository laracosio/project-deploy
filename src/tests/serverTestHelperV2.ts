import request from 'sync-request-curl';
import { Response } from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

// #region auth handlers
// place code here and delete this message
// #endregion

// #region user handlers
// place code here and delete this message
// #endregion

// #region quiz handlers
// place code here and delete this message
// #endregion

// #region player handlers
// place code here and delete this message
// #endregion

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

export {
  authUserDetailsRequestV2
};
