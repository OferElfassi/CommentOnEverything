const express = require('express');
const hashtagController = require('../controllers/hashtag-controller');
const {body} = require('express-validator');
const isAuth = require('../middelware/is-auth');
const router = express.Router();

const validators = {
    hashtagData: body('hashtagName')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Missing hashtag name'),
};

router.get('/', hashtagController.getHashTags);
router.post('/', isAuth, validators.hashtagData, hashtagController.addHashtag);

module.exports = router;
