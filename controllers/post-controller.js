const {validationResult} = require("express-validator");
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
        const posts = await Post.find({}).populate({
            path: "reactions",
            populate: {
                path: "user",
                model: User,
                select: {lastname: 1, firstname: 1,fullName: 1, image: 1, _id: 1},
            },
        })
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    model: User,
                    select: {lastname: 1, firstname: 1,fullName: 1, image: 1, _id: 1},
                },
            })
            .populate({path: "user", select: {lastname: 1, firstname: 1, image: 1, _id: 1}})
            .populate({path: "hashtag", select: {title: 1}});

        if (!posts) {
            throw new HttpError("cant get posts data", 404);
        }
        res.status(200).json({message: "success", data: posts});
    } catch (e) {
        next(e);
    }
};

exports.getPostsById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId).populate({
            path: "reactions",
            select: {like: 1},
            match: {like: true},
        })
            .populate({
                path: "comments",
                populate: {path: "user", model: User},
            })
            .populate({path: "user", select: {fullName: 1, image: 1, _id: 1}})
            .populate("hashtag");
        if (!post) {
            throw new HttpError("cant get post data", 404);
        }
        res.status(200).json({message: "success", data: post});
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
        await Post.populate(posts, {
            path: 'reactions', model: Reaction,
        })

        await Post.populate(posts, {
            path: 'comments', model: Comment,
        })

        await Post.populate(posts, {
            path: 'user', model: User,
        })


        if (!posts) {
            throw new HttpError("cant get posts data", 404);
        }
        res.status(200).json({message: "success", data: posts});
    } catch (e) {
        next(e);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        await Post.deleteOne({_id: req.params.postId, user: req.user._id});
        res.status(200).json({message: "success", data: null});
    } catch (e) {
        next(e);
    }
};

exports.createPost = async (req, res, next) => {

    try {
        checkValidationResult(req);
        const post = new Post({
            description: req.body.description,
            image: {url: req.body.imageUrl, key: req.body.imageKey},
            reactions: [],
            comments: [],
            user: req.user._id,
        });
        let hashtag = null;
        if (req.body.hashtag) {
            hashtag = await Hashtag.findOne({title: req.body.hashtag});
            if (!hashtag) {
                hashtag = new Hashtag({title: req.body.hashtag, posts: []});
            }
        } else {
            hashtag = await Hashtag.findOne({title: "General"});
        }
        post.hashtag = hashtag._id
        hashtag.posts.push(post);
        await hashtag.save();
        await post.save();
        res.status(200).json({message: "success", data: post});
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

        let savedReaction = await newReaction.save();
        await Reaction.populate(savedReaction, {
            path: 'user', model: User,
            select: {fullName: 1, image: 1, _id: 1},
        })
        post.reactions.push(newReaction);
        await post.save();
        res.status(200).json({message: "success", data: savedReaction});
    } catch (e) {
        next(e);
    }
};
exports.deleteReaction = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId).populate({
            path: "reactions",
        });
        const reaction = await Reaction.findById(req.params.reactionId);
        if (!post) {
            throw new HttpError("cant find this post", 404);
        }
        if (!reaction) {
            throw new HttpError("cant find this reaction", 404);
        }
        post.reactions.remove(req.params.reactionId);
        await post.save();
        await Reaction.deleteOne({_id: req.params.reactionId})
        res.status(200).json({message: "success", data: null});
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
        const savedComment = await newComment.save();
        await Comment.populate(savedComment, {
            path: 'user', model: User,
            select: {lastname: 1, firstname: 1,fullName: 1, image: 1, _id: 1},
        })
        post.comments.push(newComment);
        await post.save();
        res.status(200).json({message: "success", data: savedComment});
    } catch (e) {
        next(e);
    }
};

exports.getNewPostImage = async (req, res, next) => {
    try {
        const postsPhotos = await Post.find({}).select({image: 1, _id: 1});
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

        res.status(200).json({message: "success", data: null});
    } catch (e) {
        next(e);
    }
};
