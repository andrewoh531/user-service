import uuid from 'node-uuid';
import UserModel from '../libs/UserModel';

function validateInput(payload) {
  const requiredParameters = ['fbId', 'name', 'email'];

  for(const requiredParam of requiredParameters) {
    if (!payload[requiredParam]) {
      throw new Error(`Missing ${requiredParam} parameter`);
    }
  }
}

function createUserIfNonExistent(event) {
  return (res) => {
    if (res.Count < 1) {
      event.userId = uuid.v4();
      return UserModel.createAsync(event);
    } else if (res.Count > 1) {
      throw new Error(`More than 1 user found for search by FbId`)
    } else {
      return res.Items[0];
    }
  };
}

export function getOrCreateUser(event, ctx, cb) {
  try {
    validateInput(event);
    UserModel.query(event.fbId)
      .usingIndex('FbIdIndex')
      .execAsync()
      .then(createUserIfNonExistent(event))
      .then(res => cb(null, JSON.parse(JSON.stringify(res))))
      .catch(err => {
        console.error(`Error calling UserModel.getAsync = ${JSON.stringify(err)}`);
        cb(err);
      });
  } catch (err) {
    cb(err);
  }
}
