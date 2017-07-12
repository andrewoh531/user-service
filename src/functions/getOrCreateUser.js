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

async function createUserIfNonExistent(event, userQueryResponse) {
  if (userQueryResponse.Count < 1) {
    event.userId = uuid.v4();
    return UserModel.createAsync(event);
  } else if (userQueryResponse.Count > 1) {
    throw new Error(`More than 1 user found for search by FbId`)
  } else {
    return userQueryResponse.Items[0];
  }
}

export async function getOrCreateUser(event, ctx, cb) {
  try {
    validateInput(event);

    const user = await UserModel.query(event.fbId)
      .usingIndex('FbIdIndex')
      .execAsync();

    const createUserResponse = await createUserIfNonExistent(event, user);
    cb(null, JSON.parse(JSON.stringify(createUserResponse)));

  } catch (err) {
    cb(err);
  }
}
