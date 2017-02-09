const _ = require('lodash');
const Promise = require('bluebird');

const apps = [
  {id: '099db7ca', name: 'webapp1', client_secret: 'King Jehova'},
  {id: 'aa23128a', name: 'webapp2', client_secret: 'Alibaba and 40 robbers'},
];

/***
 * Return resolve(client_secret) for an input appid
 * @param appid
 */
exports.getClientSecret = (appid) => {
  return new Promise((resolve, reject) => {
    let i = _.findIndex(apps, {'id': appid});
    if (i < 0) {
      reject(new Error('Appid is invalid'));
    }
    resolve(apps[i].client_secret);
  });
};