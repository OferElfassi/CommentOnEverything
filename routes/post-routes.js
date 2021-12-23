const express = require("express");
const postController = require("../controllers/post-controller");
const {body} = require('express-validator')
const isAuth = require("../middelware/is-auth");
const router = express.Router();

const validators = {
    postDescription : body('description').exists().not().isEmpty()
        .withMessage('Missing post review description'),
    reactionType: body('reactionType').exists().isIn(['like', 'report'])
        .withMessage('Missing reaction type (like or report) '),
    commentContent : body('content').exists().not().isEmpty()
        .withMessage('Missing comment content'),
}

router.get("/", postController.getPosts);
router.get("/:postId", postController.getPostsById);
router.get("/hashtag/:hashName", postController.getPostsByHashtag);
router.delete("/:postId", isAuth, postController.deletePost);
router.post("/", isAuth,validators.postDescription, postController.createPost);
router.put("/reaction/:postId", isAuth,validators.reactionType, postController.addReactionToPost);
router.put("/comment/:postId" ,isAuth,validators.commentContent, postController.addCommentToPost);

module.exports = router;
