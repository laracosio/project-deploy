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
  let user1: Response, user2: Response, user3: Response;
  beforeEach(() => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
    user2 = authLoginRequest(person1.email, person1.password);
    user3 = authLoginRequest(person1.email, person1.password);
  });
  test('Token was successfully removed from dataStore - single logout from multiple sessions for same user', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const user2Data = JSON.parse(user2.body.toString());
    const user3Data = JSON.parse(user3.body.toString());

    const response: Response = authLogoutRequestV2(user3Data.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});

    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      expect(data.mapUT.some(user => user.token === user1Data.token)).toStrictEqual(true);
      expect(data.mapUT.some(user => user.token === user2Data.token)).toStrictEqual(true);
      expect(data.mapUT.some(user => user.token === user3Data.token)).toStrictEqual(false);
    }
  });
  test('Token was successfully removed from dataStore - multiple logouts from multiple sessions for same user', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const user2Data = JSON.parse(user2.body.toString());
    const user3Data = JSON.parse(user3.body.toString());

    authLogoutRequestV2(user1Data.token);
    authLogoutRequestV2(user2Data.token);
    const response: Response = authLogoutRequestV2(user3Data.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});

    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      expect(data.mapUT.some(user => user.token === user1Data.token)).toStrictEqual(false);
      expect(data.mapUT.some(user => user.token === user2Data.token)).toStrictEqual(false);
      expect(data.mapUT.some(user => user.token === user3Data.token)).toStrictEqual(false);
    }
  });
});
