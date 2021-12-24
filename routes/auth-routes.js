const express = require("express");
const authController = require("../controllers/auth-controller");
const {body} = require("express-validator");
const router = express.Router();

const validators = {
    signupFields : [
        body('firstname').exists().not().isEmpty().withMessage('Missing firstname'),
        body('lastname').exists().not().isEmpty().withMessage('Missing lastname'),
        body('email').exists().not().isEmpty().isEmail().withMessage('Missing valid email'),
        body('password').exists().not().isEmpty().withMessage('Missing password'),
    ],
    loginFields : [
        body('email').exists().not().isEmpty().isEmail().withMessage('Missing valid email'),
        body('password').exists().not().isEmpty().withMessage('Missing password'),
    ],
}

router.post("/signup",validators.signupFields, authController.signup);
router.post("/login",validators.loginFields ,authController.login);

module.exports = router;
