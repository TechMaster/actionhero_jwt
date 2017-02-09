/**
 * Created by techmaster on 2/5/17.
 */
exports.default = {
  session: function (api) {
    return {
      jwtSecret: 'JWTSECRET',
      algorithm: 'HS256',
      defaultExpiration: 2592000,
      // See README.md for usage on this param
      devToken: null
    };
  }
};