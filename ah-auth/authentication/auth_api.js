/**
 * Created by techmaster on 2/8/17.
 */
const db = require('../db');
const config = require('./authenticate.json');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

/***
 *
 * @param user
 * @param client_secret must be protected
 * @param expiration
 * @returns {Promise}
 */

function createToken (user, client_secret, expiration) {
  return new Promise((resolve) => {
    let body = {
        id: user.id,
        username: user.username,
        email: user.email
      },
      options = {
        algorithm: config.algorithm,
        expiresIn: expiration || config.defaultExpiration,
        subject: '' + user.id
      };

    resolve(jwt.sign(body, client_secret, options));
  });
}
exports.createToken = createToken;
/***
 * Decode token using clientSecret
 * @param clientSecret
 * @param token
 * @returns {Promise}
 */
function decodeToken (clientSecret, token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, clientSecret, {algorithm: config.algorithm}, (err, decodedPayload) => {
      if (err) {
        return reject('Fail to decode token');
      }
      return resolve(decodedPayload);
    });
  });
}

exports.decodeToken = decodeToken;
/***
 * Get client-secret for specific user and appid
 * @param user
 * @param appid
 */
function clientSecretOfUser (user, appid){
  return new Promise((resolve, reject) => {
    if (_.indexOf(user.apps, appid) < 0) {
      reject('User not allow to this app ');
    } else {
      resolve(db.apps.getClientSecret(appid));
    }
  });
}

exports.clientSecretOfUser = clientSecretOfUser;


exports.login = (username, password, appid) => {
  return db.users.login(username, password, appid)  //data.param.appid is client-id
    .then((user) => {
      return db.apps.getClientSecret(appid)
        .then((client_secret) => {
          return createToken(user, client_secret);
        });
    });

};