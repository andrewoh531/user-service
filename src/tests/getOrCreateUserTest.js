import tester from 'lambda-tester';
import {expect} from 'chai';

import UserModel from '../libs/UserModel';
import { getOrCreateUser } from '../functions/getOrCreateUser';

function expectQueryCount(fbId, count) {
  return UserModel
    .query(fbId)
    .usingIndex('FbIdIndex')
    .execAsync()
    .then(res => {
      expect(res.Count).to.equal(count);
    });
}

function deleteUser(userId) {
  return UserModel.destroyAsync(userId);
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

  it('should create user if user does not exists', done => {

    let userId = null;

    expectQueryCount(payload.fbId, 0)
      .then(() => {
        return tester(getOrCreateUser)
          .event(payload)
          .expectResult(res => {
            expect(res.fbId).to.equal(payload.fbId);
            expect(res.name).to.equal(payload.name);
            expect(res.email).to.equal(payload.email);
            expect(res.userId).to.be.ok;
            userId = res.userId;
          })
      })
      .then(() => expectQueryCount(payload.fbId, 1))
      .then(() => deleteUser(userId))
      .then(done)
      .catch(done);
  });

  it('should retrieve existing user when user already exist', done => {
    let userId = null;
    const newUser = {
      fbId,
      name: 'SecondUser',
      email: 'second@user.com'
    };
    tester(getOrCreateUser)
      .event(payload)
      .expectResult()
      .then(() => {
        return tester(getOrCreateUser)
          .event(newUser)
          .expectResult(res => {
            expect(res.fbId).to.equal(payload.fbId);
            expect(res.name).to.equal(payload.name);
            expect(res.email).to.equal(payload.email);
            expect(res.userId).to.be.ok;
            userId = res.userId;
          });
      })
      .then(() => deleteUser(userId))
      .then(() => done())
      .catch(done);
  });

  it('should error when trying to save with extra parameters provided', done => {
    const payloadWithExtras = Object.assign({}, payload, {fbId: 'extras', a: 'a', b: 'b', c: 'c'});

    tester(getOrCreateUser)
      .event(payloadWithExtras)
      .expectError(err => {
        expect(err.cause.name).to.equal('ValidationError');
        done();
      })
      .catch(done);
  })
});
