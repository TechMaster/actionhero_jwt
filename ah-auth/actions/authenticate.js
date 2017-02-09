const auth_api = require('../authentication/auth_api');

exports.login = {
  name: 'authen.login',
  description: 'Receive username, password, app_id then authenticate user',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {
    username: {required: true},
    password: {required: true},
    appid: {required: true},
  },
  //TODO: Cần làm nốt hàm này
  /***
   * if login success, create JWT token
   * @param api
   * @param data
   * @param next
   */
  run: function (api, data, next) {
    auth_api.login(data.params.username, data.params.password, data.params.appid)
      .then((token) => {
        data.connection.rawConnection.responseHeaders.push(['authorization', 'JWT '.concat(token)]);
        data.connection.rawConnection.responseHttpCode = 200;
        data.response.message = 'Authenticated successfully';
        next();
      })
      .catch((error) => {
        data.connection.rawConnection.responseHttpCode = 401;
        data.response.message = 'Get Client Secret failed: '.concat(error);
        next();
      });

  }
};
