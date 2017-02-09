/**
 * Created by techmaster on 2/8/17.
 */
const chai = require('chai');
chai.should();

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const db = require('../db');
const Promise = require('bluebird');
const auth_api = require('../authentication/auth_api');
const _ = require('lodash');

let client_secret;  //Use a share client secret to encode and decode
let saved_token;    //Store token

describe('Test authentication api', () => {
  it('it should create token for login user', (done) => {

    db.users.findByUserName('jack')
      .then((user) => {
        const appid = user.apps[0];  //get this first app_id from each user.app_id is similar client_id

        return auth_api.clientSecretOfUser(user, appid)
          .then((return_client_secret) => {
            client_secret = return_client_secret;

            return auth_api.createToken(user, client_secret, 5000);
          });

      })
      .then((token) => {
        saved_token = token;
        token.should.have.length.above(10);
        done();
      });
  });

  it('throw error when user use wrong appid', () => {
    return db.users.findByUserName('jack')
      .then((user) => {
        const appid = 'An incorrect appid';
        return auth_api.clientSecretOfUser(user, appid).should.eventually.rejectedWith('User not allow to this app');
      });
  })
});


describe('Test decoding token', () => {
  /***
   * Hàm này rất dị có thể kiểm thử điều kiện OR trong hàm satisfy
   */
  it('it should decode token using client secret', () => {
    return auth_api.decodeToken(client_secret, saved_token)
      .should.eventually.satisfy((payload) => {
        return payload.username === 'jack' && payload.email === 'jack@example.com';
      });
  });

  it('With wrong client secret should throw error', () => {
    return auth_api.decodeToken('Incorrect token', saved_token).should.eventually.rejectedWith('Fail to decode token');
  });
});