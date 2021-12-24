const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const HttpError = require("../utils/HttpError");

const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            throw new HttpError("Not authenticated", 401);
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, "secretstring");
        if (!decodedToken) {
            throw new HttpError("Not authenticated", 401);
        }
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            throw new HttpError("Cant find user", 404);
        }
        req.user = user;
        return next();

    } catch (e) {
        next(e);
    }
}

module.exports = isAuth;
