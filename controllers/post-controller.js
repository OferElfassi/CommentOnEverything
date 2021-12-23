const {validationResult} = require('express-validator');
const Post = require('../models/post-model');
const HttpError = require('../utils/HttpError');
const User = require('../models/user-model');
const Reaction = require('../models/reaction-model');
const Hashtag = require('../models/hashtag-model');
const Comment = require('../models/comment-model');
const checkValidationResult = require('../utils/check-validation-result');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    if (!posts) {
      throw new HttpError('cant find posts', 404);
    }
    const populatedPosts = await posts
      .populate('reactions')
      .populate({path: 'comments', populate: {path: 'user', model: 'users'}})
      .populate('user')
      .populate('hashtag');

    if (!populatedPosts) {
      throw new HttpError('cant get posts data', 404);
    }
    res.status(200).json({message: 'success', data: populatedPosts});
  } catch (e) {
    next(e);
  }
};

exports.getPostsById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      throw new HttpError('cant find this post', 404);
    }
    const populatedPost = await post
      .populate('reactions')
      .populate({path: 'comments', populate: {path: 'user', model: 'users'}})
      .populate('user')
      .populate('hashtag');
    if (!populatedPost) {
      throw new HttpError('cant get post data', 404);
    }
    res.status(200).json({message: 'success', data: populatedPost});
  } catch (e) {
    next(e);
  }
};

exports.getPostsByHashtag = async (req, res, next) => {
  try {
    const posts = await Post.findByHashtag(req.params.hashName);
    if (!posts) {
      throw new HttpError('cant find this posts', 404);
    }
    const populatedPosts = await posts
      .populate('reactions')
      .populate({path: 'comments', populate: {path: 'user', model: 'users'}})
      .populate('user')
      .populate('hashtag');
    if (!populatedPosts) {
      throw new HttpError('cant get posts data', 404);
    }
    res.status(200).json({message: 'success', data: populatedPosts});
  } catch (e) {
    next(e);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await Post.deleteOne({_id: req.params.postId, user: req.user._id});
    res.status(200).json({message: 'success', data: null});
  } catch (e) {
    next(e);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    checkValidationResult(req);
    const post = new Post({
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      reactions: [],
      comments: [],
      user: req.user._id,
      hashtag: req.body.hashtagName,
    });

    let hashtag = null;
    if (req.body.hashtagName) {
      hashtag = Hashtag.find({title: req.body.hashtagName});
      if (!hashtag) {
        hashtag = new Hashtag({title: req.body.hashtagName});
      }
    } else {
      hashtag = Hashtag.find({title: 'General'});
    }

    hashtag.posts.push(post);
    await hashtag.save();
    await post.save();
    res.status(200).json({message: 'success', data: post});
  } catch (e) {
    next(e);
  }
};

exports.addReactionToPost = async (req, res, next) => {
  try {
    checkValidationResult(req);
    const post = await Post.findById(req.params.postId);
    if (!post) {
      throw new HttpError('cant find this post', 404);
    }
    const newReaction = new Reaction({
      [req.body.reactionType]: true,
      user: req.user._id,
    });
    await newReaction.save();
    post.reactions.push(newReaction);
    await post.save();
    res.status(200).json({message: 'success', data: post});
  } catch (e) {
    next(e);
  }
};

exports.addCommentToPost = async (req, res, next) => {
  try {
    checkValidationResult(req);
    const post = await Post.findById(req.params.postId);
    if (!post) {
      throw new HttpError('cant find this post', 404);
    }

    const newComment = new Comment({
      content: req.body.content,
      user: req.user._id,
    });
    await newComment.save();
    post.comments.push(newComment);
    await post.save();
    res.status(200).json({message: 'success', data: post});
  } catch (e) {
    next(e);
  }
};
