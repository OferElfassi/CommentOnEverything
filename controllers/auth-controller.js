const User = require('../models/user-model');
const Post = require('../models/post-model');
const Notification = require('../models/notification-model');
const HttpError = require('../utils/HttpError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkValidationResult = require('../utils/check-validation-result');

exports.signup = async (req, res, next) => {
    try {
        console.log(req.body)
        checkValidationResult(req);
        const user = await User.findOne({email: req.body.email});
        if (user) {
            console.log(user)
            throw new HttpError('this email is already exists', 401);
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json({message: 'success', data: newUser});
    } catch (e) {
        next(e);
    }
};

exports.login = async (req, res, next) => {
    try {
        checkValidationResult(req);
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            throw new HttpError('User not exists', 401);
        }
        const passwordMatch = await bcrypt.compare(
            req.body.password,
            user.password,
        );
        if (!passwordMatch) {
            throw new HttpError('Wrong password', 401);
        }
        const token = jwt.sign(
            {email: user.email, userId: user._id},
            'secretstring',
            // {expiresIn: '2h'},
        );
        await User.populate(user, {path: 'posts', model: Post, populate: {path: 'hashtag'}})
        await User.populate(user, {
            path: 'notifications',
            model: Notification,
            populate: {path: 'post', model: Post,select: {image: 1, _id: 1}},

        })
        res
            .status(200)
            .json({
                message: 'success',
                data: {user: user.toObject({virtuals: true}), token},
            });
    } catch (e) {
        next(e);
    }
};
