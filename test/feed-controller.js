const expect = require('chai').expect;
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function () {
  before(function (done) {
    mongoose
      .connect(process.env.DATABASE_UNIT_TEST_URL)
      .then((result) => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5c0f66b979af55031b34728a',
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function () {});

  afterEach(function () {});

  it('should add a created post to the posts of the creator', async function () {
    this.timeout(10000); // Set the timeout to 10 seconds

    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post',
      },
      file: {
        path: 'abc',
      },
      userId: '5c0f66b979af55031b34728a',
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    try {
      const savedUser = await FeedController.createPost(req, res, () => {});
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
    } catch (error) {
      // Handle any errors
      throw error;
    }
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
