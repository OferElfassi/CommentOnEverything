const { validationResult } = require("express-validator");
const Post = require("../models/post-model");
const HttpError = require("../utils/HttpError");
const User = require("../models/user-model");
const Reaction = require("../models/reaction-model");
const Hashtag = require("../models/hashtag-model");
const Comment = require("../models/comment-model");
const compareImages = require("../utils/compare-images");
const checkValidationResult = require("../utils/check-validation-result");
const s3 = require("../s3");

exports.getPosts = async (req, res, next) => {
  try {
    // const posts = await Post.find({});
    // if (!posts) {
    //   throw new HttpError("cant find posts", 404);
    // }
    // const populatedPosts = await posts
    const posts = await Post.find({}).populate({
        path: "reactions",
        select: { like: 1 },
        match: { like: true },
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          model: "users",
          select: { fullName: 1, image: 1, _id: 1 },
        },
      })
      .populate({ path: "user", select: {lastname:1, firstname: 1, image: 1, _id: 1 } })
      .populate({path:"hashtag",select:{title:1}});

    if (!posts) {
      throw new HttpError("cant get posts data", 404);
    }
    res.status(200).json({ message: "success", data: posts });
  } catch (e) {
    next(e);
  }
};

exports.getPostsById = async (req, res, next) => {
  try {
    // const post = await Post.findById(req.params.postId);
    // if (!post) {
    //   throw new HttpError("cant find this post", 404);
    // }
    // const populatedPost = await post
    const post = await Post.findById(req.params.postId).populate({
        path: "reactions",
        select: { like: 1 },
        match: { like: true },
      })
      .populate({
        path: "comments",
        populate: { path: "user", model: "users" },
      })
      .populate({ path: "user", select: { fullName: 1, image: 1, _id: 1 } })
      .populate("hashtag");
    if (!post) {
      throw new HttpError("cant get post data", 404);
    }
    res.status(200).json({ message: "success", data: post });
  } catch (e) {
    next(e);
  }
};

exports.getPostsByHashtag = async (req, res, next) => {
  try {
    const posts = await Post.findByHashtag(req.params.hashName);
    if (!posts) {
      throw new HttpError("cant find this posts", 404);
    }
    const populatedPosts = await posts
      .populate("reactions")
      .populate({
        path: "comments",
        populate: { path: "user", model: "users" },
      })
      .populate("user")
      .populate("hashtag");
    if (!populatedPosts) {
      throw new HttpError("cant get posts data", 404);
    }
    res.status(200).json({ message: "success", data: populatedPosts });
  } catch (e) {
    next(e);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await Post.deleteOne({ _id: req.params.postId, user: req.user._id });
    res.status(200).json({ message: "success", data: null });
  } catch (e) {
    next(e);
  }
};

exports.createPost = async (req, res, next) => {
  //comment-on-everything-bucket
  //commentOnEverythingApp
  //AKIASWTHNULYHPLYKZFW
  try {
    checkValidationResult(req);
    const post = new Post({
      description: req.body.description,
      image: {url:req.body.imageUrl,key:req.body.imageKey},
      reactions: [],
      comments: [],
      user: req.user._id,
    });
    let hashtag = null;
    if (req.body.hashtagName) {
      hashtag = await Hashtag.findOne({ title: req.body.hashtagName });
      if (!hashtag) {
        hashtag = new Hashtag({ title: req.body.hashtagName,posts:[] });
      }
    } else {
      hashtag = await Hashtag.findOne({ title: "General" });
    }
    post.hashtag=hashtag._id
    hashtag.posts.push(post);
    await hashtag.save();
    await post.save();
    res.status(200).json({ message: "success", data: post });
  } catch (e) {
    next(e);
  }
};

exports.addReactionToPost = async (req, res, next) => {
  try {
    checkValidationResult(req);
    const post = await Post.findById(req.params.postId);
    if (!post) {
      throw new HttpError("cant find this post", 404);
    }
    const newReaction = new Reaction({
      [req.body.reactionType]: true,
      user: req.user._id,
    });
    await newReaction.save();
    post.reactions.push(newReaction);
    await post.save();
    res.status(200).json({ message: "success", data: post });
  } catch (e) {
    next(e);
  }
};

exports.addCommentToPost = async (req, res, next) => {
  try {
    checkValidationResult(req);
    const post = await Post.findById(req.params.postId);
    if (!post) {
      throw new HttpError("cant find this post", 404);
    }

    const newComment = new Comment({
      content: req.body.content,
      user: req.user._id,
    });
    await newComment.save();
    post.comments.push(newComment);
    await post.save();
    res.status(200).json({ message: "success", data: post });
  } catch (e) {
    next(e);
  }
};

exports.getNewPostImage = async (req, res, next) => {
  try {
    const postsPhotos = await Post.find({}).select({ image: 1, _id: 1 });
    if (!postsPhotos) {
      throw new HttpError("cant find any photos to compare with", 404);
    }
    const matches = await compareImages(req.file.location, postsPhotos);
    res.status(200).json({
      message: "success",
      data: {
        matches,
        imageKey: req.file.key,
        imageUrl: req.file.location,
      },
    });
  } catch (e) {
    next(e);
  }
};
exports.deleteImageFromBucket = async (req, res, next) => {
  try {
    await s3.deleteImage(req.params.imageKey);

    res.status(200).json({ message: "success", data: null });
  } catch (e) {
    next(e);
  }
};
