const Post = require("../models/post-model");
const HttpError = require("../utils/HttpError");
const Hashtag = require("../models/hashtag-model");
const checkValidationResult = require("../utils/check-validation-result");

exports.getHashTags = async (req, res, next) => {
    try {
        const hashtags = await Post.find({})
        if (!hashtags) {
            throw new HttpError("cant get hashtags data", 404);
        }
        res.status(200).json({message: "success", data: hashtags});
    } catch (e) {
        next(e);
    }
};

exports.addHashtag = async (req, res, next) => {
    try {
        checkValidationResult(req);
        const hashtag = new Hashtag({
            title: req.body.hashtagName,
            posts: []
        })
        await hashtag.save()
        res.status(200).json({message: "success", data: hashtag});
    } catch (e) {
        next(e);
    }
};
