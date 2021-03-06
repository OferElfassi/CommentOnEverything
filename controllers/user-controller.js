const User = require('../models/user-model');
const Post = require('../models/post-model');
const Comment = require('../models/comment-model');
const HttpError = require('../utils/HttpError');
const s3 = require('../s3');
const Notification = require("../models/notification-model");

exports.getUsers = async (req, res, next) => {
    try {
        if (!req.user.isManager) {
            throw new HttpError('Unauthorized', 401);
        }
        const users = await User.find({}).populate({
            path: "notifications",
            model: Notification,
            populate: {
                path: "post",
                model: Post,
                select: {image: 1, _id: 1},
            },
        })
        if (!users) {
            throw new HttpError('cant find users', 404);
        }
        res.status(200).json({message: 'success', data: users});
    } catch (e) {
        next(e);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            throw new HttpError('cant find this user', 404);
        }
        await User.populate(user, {path: 'posts', model: Post})
        await User.populate(user, {path: 'following', model: User})

        if (!user) {
            throw new HttpError('cant get user data', 404);
        }
        res.status(200).json({message: 'success', data: user});
    } catch (e) {
        next(e);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        if (!req.user.isManager && !(req.user._id === req.params.userId)) {
            console.log(req.user)
            throw new HttpError('Unauthorized', 401);
        }
       await Post.remove({user:req.params.userId})
       await Comment.remove({user:req.params.userId})
        await User.deleteOne({_id: req.params.userId});
        res.status(200).json({message: 'success', data: null});
    } catch (e) {
        next(e);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        if (!req.user._id === req.params.userId) {
            throw new HttpError('Unauthorized', 401);
        }
        const user = req.user;
        Object.assign(user, req.body);
        await user.save();
        res.status(200).json({message: 'success', data: user.toObject({virtuals: true})});
    } catch (e) {
        next(e);
    }
};

exports.uploadProfilePic = async (req, res, next) => {
    try {
        if (req.user.image && req.user.image.url) {
            await s3.deleteImage(req.user.image.key);
        }
        console.log(req)
        req.user.image.url = req.file.location;
        req.user.image.key = req.file.key;
        await req.user.save();
        res.status(200).json({message: 'success', data: req.user.image});
    } catch (e) {
        next(e);
    }
};

