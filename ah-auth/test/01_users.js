const chai = require('chai');
chai.should();

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const db = require('../db');

const Promise = require("bluebird");

describe("Test db/users", () => {
  /***
   * This is blocking ~ synchronous test
   */
  it('Should find user by username', () => {
    return db.users.findByUserName('jack').should.eventually.have.property('username').equal('jack');
  });


  /***
   * Sử dụng promise code viết gọn hơn
   */
  it('Login user: jack, password: 1qaz and promise', () => {
    return db.users.login('jack', '1qaz', '099db7ca').should.eventually.have.property('username').equal('jack');
  });

   it('Correct user/pass but wrong appid should return error', () => {
    return db.users.login('jack', '1qaz', 'NonExistAppId').should.eventually.rejectedWith('User is not allowed to use this app');
  });



  it('it should return apps when input correct user', () => {
    return db.users.getUserApps('tom').should.eventually.contain('aa23128a');
  });

  /***
   * Test error return when username is incorrect
   */
  it('it should throw error when input incorrect user', () => {
    return db.users.getUserApps('tommy').should.eventually.rejectedWith('user is not found');
  });

});