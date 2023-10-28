const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller', () => {
  let createdUserId; // Variable to store the user ID created in the "before" hook

  before(async () => {
    await mongoose.connect(process.env.DATABASE_UNIT_TEST_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = new User({
      email: 'test@test.com',
      password: 'tester',
      name: 'Test',
      posts: [],
    });

    const savedUser = await user.save();
    createdUserId = savedUser._id; // Store the created user's ID
  });

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

  it('should send a response with a valid user status for an existing user', async () => {
    const req = { userId: createdUserId }; // Use the created user's ID
    const res = {
      statusCode: 500,
      userStatus: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.userStatus = data.status;
      },
    };

    await AuthController.getUserStatus(req, res, () => {});

    expect(res.statusCode).to.equal(200);
    expect(res.userStatus).to.equal('I am new!');
  });

  after(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
  });
});
