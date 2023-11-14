import { Response } from 'sync-request-curl';
import { authLoginRequest, authRegisterRequest, clearRequest } from '../../it2/serverTestHelperIt2';
import { person1 } from '../../../testingData';
import { Datastore } from '../../../dataStore';
import { authLogoutRequestV2 } from '../../serverTestHelperIt3';
import fs from 'fs';

beforeEach(() => {
  clearRequest();
});

// auth/logout tests
describe('POST /v2/admin/auth/logout - Success Cases', () => {
  let session1: Response, session2: Response, session3: Response;
  beforeEach(() => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    session2 = authLoginRequest(person1.email, person1.password);
    session3 = authLoginRequest(person1.email, person1.password);
  });
  test('Token was successfully removed from dataStore - single logout from multiple sessions for same user', () => {
    const session1Data = JSON.parse(session1.body.toString());
    const session2Data = JSON.parse(session2.body.toString());
    const session3Data = JSON.parse(session3.body.toString());

    const response: Response = authLogoutRequestV2(session3Data.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});

    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      expect(data.mapUT.some(user => user.token === session1Data.token)).toStrictEqual(true);
      expect(data.mapUT.some(user => user.token === session2Data.token)).toStrictEqual(true);
      expect(data.mapUT.some(user => user.token === session3Data.token)).toStrictEqual(false);
    }
  });
  test('Token was successfully removed from dataStore - multiple logouts from multiple sessions for same user', () => {
    const session1Data = JSON.parse(session1.body.toString());
    const session2Data = JSON.parse(session2.body.toString());
    const session3Data = JSON.parse(session3.body.toString());

    authLogoutRequestV2(session1Data.token);
    authLogoutRequestV2(session2Data.token);
    const response: Response = authLogoutRequestV2(session3Data.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});

    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      expect(data.mapUT.some(user => user.token === session1Data.token)).toStrictEqual(false);
      expect(data.mapUT.some(user => user.token === session2Data.token)).toStrictEqual(false);
      expect(data.mapUT.some(user => user.token === session3Data.token)).toStrictEqual(false);
    }
  });
});