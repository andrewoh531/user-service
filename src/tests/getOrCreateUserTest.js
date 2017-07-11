import tester from 'lambda-tester';
import {expect} from 'chai';

import UserModel from '../libs/UserModel';
import {getOrCreateUser} from '../functions/getOrCreateUser';

async function expectQueryCount(fbId, count) {
  const res = await UserModel
    .query(fbId)
    .usingIndex('FbIdIndex')
    .execAsync();

  expect(res.Count).to.equal(count);
}

async function deleteUser(userId) {
  return await UserModel.destroyAsync(userId);
}

describe('getOrCreateUser', () => {

  const fbId = '1234567890abcd';
  const payload = {
    fbId,
    name: 'Full Name Here',
    email: 'test@email.com'
  };

  it('should error when userId is not provided', () => {
    return tester(getOrCreateUser)
      .event({})
      .expectError(err => {
        expect(err.message).to.equal('Missing fbId parameter');
      });
  });

  it('should return error when name not provided', () => {
    return tester(getOrCreateUser)
      .event({fbId: '1'})
      .expectError(err => {
        expect(err.message).to.equal('Missing name parameter');
      });
  });

  it('should return error when email not provided', () => {
    return tester(getOrCreateUser)
      .event({fbId: '1', name: 'ao'})
      .expectError(err => {
        expect(err.message).to.equal('Missing email parameter');
      });
  });

  it('should create user if user does not exists', async() => {
    let userId = null;

    try {
      await expectQueryCount(payload.fbId, 0);
      await tester(getOrCreateUser)
        .event(payload)
        .expectResult(res => {
          expect(res.fbId).to.equal(payload.fbId);
          expect(res.name).to.equal(payload.name);
          expect(res.email).to.equal(payload.email);
          expect(res.userId).to.be.ok;
          userId = res.userId;
        });
      await expectQueryCount(payload.fbId, 1);
    } finally {
      await deleteUser(userId);
    }
  });

  it('should retrieve existing user when user already exist', async() => {
    let userId = null;

    try {
      const newUser = {
        fbId,
        name: 'SecondUser',
        email: 'second@user.com'
      };
      await tester(getOrCreateUser)
        .event(payload)
        .expectResult();

      await tester(getOrCreateUser)
        .event(newUser)
        .expectResult(res => {
          expect(res.fbId).to.equal(payload.fbId);
          expect(res.name).to.equal(payload.name);
          expect(res.email).to.equal(payload.email);
          expect(res.userId).to.be.ok;
          userId = res.userId;
        });
    } finally {
      await deleteUser(userId);
    }
  });

  it('should error when trying to save with extra parameters provided', async () => {
    const payloadWithExtras = Object.assign({}, payload, {fbId: 'extras', a: 'a', b: 'b', c: 'c'});

    await tester(getOrCreateUser)
      .event(payloadWithExtras)
      .expectError(err => {
        expect(err.cause.name).to.equal('ValidationError');
      });
  })
});
