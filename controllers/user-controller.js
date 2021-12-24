const User = require("../models/user-model");
const HttpError = require("../utils/HttpError");
const s3 = require('../s3')
exports.getUsers = async (req, res, next) => {
    try {
        if (!req.user.isManager) {
            throw new HttpError("Unauthorized", 401);
        }
        const users = await User.find({}, "fullName _id");
        if (!users) {
            throw new HttpError("cant find users", 404);
        }
        res.status(200).json({message: "success", data: users});
    } catch (e) {
        next(e);
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            throw new HttpError("cant find this user", 404);
        }
        const populatedUser = await user.populate("posts").populate("following").exec();
        if (!populatedUser) {
            throw new HttpError("cant get user data", 404);
        }
        res.status(200).json({message: "success", data: populatedUser});
    } catch (e) {
        next(e);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        if (!req.user.isManager || !req.user._id === req.params.userId) {
            throw new HttpError("Unauthorized", 401);
        }
        await User.deleteOne({_id: req.params.userId});
        res.status(200).json({message: "success", data: null});
    } catch (e) {
        next(e);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        if (!req.user._id === req.params.userId) {
            throw new HttpError("Unauthorized", 401);
        }
        const user = req.user;
        Object.assign(user, req.body);
        await user.save();
        res.status(200).json({message: "success", data: user});
    } catch (e) {
        next(e);
    }
}

exports.uploadProfilePic = async (req, res, next) => {
    try {
        if (req.user.image && req.user.image.url) {
            await s3.deleteImage(req.user.image.key)
        }
        req.user.image.url = req.file.location
        req.user.image.key = req.file.key
        await req.user.save()
        res.status(200).json({message: "success", data: req.user.image});
    } catch (e) {
        next(e);
    }
}

