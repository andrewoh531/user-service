// Line below needed to work around bug: https://github.com/AnomalyInnovations/serverless-es7/issues/2
import stub from 'dynogels';
import Joi from 'joi';
import dynogels from 'dynogels-promisified';

dynogels.AWS.config.update({region: process.env.AWS_REGION}); // region must be set

const users = dynogels.define('users', {
  tableName: 'users',
  hashKey : 'userId',
  timestamps : false,
  schema: {
    userId: Joi.string(),
    name: Joi.string(),
    fbId: Joi.string(),
    email: Joi.string().email()
  },
  indexes : [{
    hashKey : 'fbId', name : 'FbIdIndex', type : 'global'
  }]
});

export default users;
