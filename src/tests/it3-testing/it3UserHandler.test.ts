import { Response } from 'sync-request-curl';
import { authRegisterRequest, clearRequest } from '../it2-testing/serverTestHelperIt2';
import { person1, person2 } from '../../testingData';
import { Datastore, User } from '../../dataStore';
import fs from 'fs';
import { userUpdateDetailsRequestV2, userUpdatePasswordRequestV2 } from '../serverTestHelperIt3';

beforeEach(() => {
  clearRequest();
});

// updateUserDetails test
describe('PUT /v2/user/details - Success Cases', () => {
  let session1: Response;
  beforeEach(() => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
  });
  test('email updated', () => {
    const session1Data = JSON.parse(session1.body.toString());
    const response = userUpdateDetailsRequestV2(session1Data.token, person2.email, person1.nameFirst, person1.nameLast);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});
    
    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      const userToken = data.tokens.find(t => t.sessionId === session1Data.token);
      const user: User = data.users.find(u => u.userId === userToken.userId);
      expect(user.email).toStrictEqual(person2.email);
      expect(user.nameFirst).toStrictEqual(person1.nameFirst);
      expect(user.nameLast).toStrictEqual(person1.nameLast);
    }
  });
  test('nameFirst updated', () => {
    const session1Data = JSON.parse(session1.body.toString());
    const response = userUpdateDetailsRequestV2(session1Data.token, person1.email, person2.nameFirst, person1.nameLast);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});
    
    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      const userToken = data.tokens.find(t => t.sessionId === session1Data.token);
      const user: User = data.users.find(u => u.userId === userToken.userId);
      expect(user.email).toStrictEqual(person1.email);
      expect(user.nameFirst).toStrictEqual(person2.nameFirst);
      expect(user.nameLast).toStrictEqual(person1.nameLast);
    }
  });
  test('nameLast updated', () => {
    const session1Data = JSON.parse(session1.body.toString());
    const response = userUpdateDetailsRequestV2(session1Data.token, person1.email, person1.nameFirst, person2.nameLast);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});
    
    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      const userToken = data.tokens.find(t => t.sessionId === session1Data.token);
      const user: User = data.users.find(u => u.userId === userToken.userId);
      expect(user.email).toStrictEqual(person1.email);
      expect(user.nameFirst).toStrictEqual(person1.nameFirst);
      expect(user.nameLast).toStrictEqual(person2.nameLast);
    }
  });
});

// updateUserPassword test
describe('PUT /v2/user/password - Success Cases', () => {
  let session1: Response;
  beforeEach(() => {
    session1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
  });
  test('password updated', () => {
    const session1Data = JSON.parse(session1.body.toString());
    const response = userUpdatePasswordRequestV2(session1Data.token, person1.password, person2.password);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});
    
    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      const userToken = data.tokens.find(t => t.sessionId === session1Data.token);
      const user: User = data.users.find(u => u.userId === userToken.userId);
      expect(user.password).toStrictEqual(person2.password);
    }
  });
});
