const { expect } = require('chai');
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', () => {
  it('should throw an error with code 500 if accessing the database fails', async () => {
    const findOneStub = sinon.stub(User, 'findOne');
    findOneStub.throws();

    const req = {
      body: {
        email: 'test@test.com',
        password: 'tester',
      },
    };

    try {
      await AuthController.login(req, {}, () => {});
    } catch (error) {
      expect(error).to.be.an('error');
      expect(error.statusCode).to.equal(500);
    }

    findOneStub.restore();
  });
});
