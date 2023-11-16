import { Response } from 'sync-request-curl';
import { authRegisterRequest, clearRequest } from '../../it2/serverTestHelperIt2';
import { person1, person2 } from '../../../testingData';
import { Datastore, User } from '../../../dataStore';
import fs from 'fs';
import { userUpdateDetailsRequestV2, userUpdatePasswordRequestV2 } from '../../serverTestHelperIt3';
import { hashText } from '../../../services/otherService';

beforeEach(() => {
  clearRequest();
});

// updateUserDetails test
describe('PUT /v2/user/details - Success Cases', () => {
  let user1: Response;
  beforeEach(() => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
  });
  test('email updated', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const response = userUpdateDetailsRequestV2(user1Data.token, person2.email, person1.nameFirst, person1.nameLast);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});

    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      const userToken = data.mapUT.find(t => t.token === user1Data.token);
      const user: User = data.users.find(u => u.userId === userToken.userId);
      expect(user.email).toStrictEqual(person2.email);
      expect(user.nameFirst).toStrictEqual(person1.nameFirst);
      expect(user.nameLast).toStrictEqual(person1.nameLast);
    }
  });
  test('nameFirst updated', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const response = userUpdateDetailsRequestV2(user1Data.token, person1.email, person2.nameFirst, person1.nameLast);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});

    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      const userToken = data.mapUT.find(t => t.token === user1Data.token);
      const user: User = data.users.find(u => u.userId === userToken.userId);
      expect(user.email).toStrictEqual(person1.email);
      expect(user.nameFirst).toStrictEqual(person2.nameFirst);
      expect(user.nameLast).toStrictEqual(person1.nameLast);
    }
  });
  test('nameLast updated', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const response = userUpdateDetailsRequestV2(user1Data.token, person1.email, person1.nameFirst, person2.nameLast);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});

    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      const userToken = data.mapUT.find(t => t.token === user1Data.token);
      const user: User = data.users.find(u => u.userId === userToken.userId);
      expect(user.email).toStrictEqual(person1.email);
      expect(user.nameFirst).toStrictEqual(person1.nameFirst);
      expect(user.nameLast).toStrictEqual(person2.nameLast);
    }
  });
});

// updateUserPassword test
describe('PUT /v2/user/password - Success Cases', () => {
  let user1: Response;
  beforeEach(() => {
    user1 = authRegisterRequest(person1.email, person1.password, person1.nameFirst, person1.nameLast);
  });
  test('password updated', () => {
    const user1Data = JSON.parse(user1.body.toString());
    const response = userUpdatePasswordRequestV2(user1Data.token, person1.password, person2.password);
    expect(response.statusCode).toStrictEqual(200);
    expect(JSON.parse(response.body.toString())).toStrictEqual({});

    if (fs.existsSync('datastore.json')) {
      const datastr: Buffer = fs.readFileSync('./datastore.json');
      const data: Datastore = JSON.parse(String(datastr));
      const userToken = data.mapUT.find(t => t.token === user1Data.token);
      const user: User = data.users.find(u => u.userId === userToken.userId);
      expect(user.password).toStrictEqual(hashText(person2.password));
    }
  });
});
