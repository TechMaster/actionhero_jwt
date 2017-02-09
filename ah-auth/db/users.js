const _ = require('lodash');
const Promise = require('bluebird');

const users = [
  {
    id: 'c27526ad',
    username: 'jack',
    password: '1qaz',
    email: 'jack@example.com',
    fullname: 'Jack London',
    apps: ['099db7ca', 'aa23128a']
  },
  {
    id: 'e1f25f8f',
    username: 'tom',
    password: '123',
    email: 'tom@example.com',
    fullname: 'Tommy Hero',
    apps: ['aa23128a']
  }
];


exports.findByUserName = (username) => {
  return new Promise((resolve, reject) => {
    let user = users[_.findIndex(users, {'username': username})];
    if (user) {
      resolve(user);
    } else {
      reject(new Error('user is not found'));
    }
  })
};
/***
 * Returns user only if username, password, appid are matched
 * @param username
 * @param password
 * @param appid clientID of app
 */
exports.login = (username, password, appid) => {
  return new Promise((resolve, reject) => {
    let index = _.findIndex(users, {'username': username, 'password': password});
    if (index < 0) {
      reject('Login failed');
    } else {
      let user_apps = users[index].apps;
      let appIndex = _.indexOf(user_apps, appid);
      if (appIndex < 0) {
        reject('User is not allowed to use this app');
      } else {
        resolve(users[index]);
      }
    }
  });
};
/***
 * This function use Promise
 * @param username
 */
exports.getUserApps = (username) => {
  return new Promise((resolve, reject) => {
    let user = users[_.findIndex(users, {'username': username})];
    if (user) {
      resolve(user.apps);
    } else {
      reject(new Error('user is not found'));
    }
  })
};