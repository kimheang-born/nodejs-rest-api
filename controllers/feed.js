const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
    .sort({ createdAt: 'desc' })
    .then((posts) => {
      res.status(200).json({
        message: 'Fetched posts successfully.',
        posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validatio failed!');
    error.statusCode = 422;
    throw error;
    // return res.status(422).json({
    //   message: 'Validatio failed!',
    //   errors: errors.array(),
    // });
  }

  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
    imageUrl: 'images/duck.jpeg',
    creator: {
      name: 'Kim',
    },
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: 'Post fetched.',
        post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
