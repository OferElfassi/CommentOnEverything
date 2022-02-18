const express = require('express');
const postController = require('../controllers/post-controller');
const {body} = require('express-validator');
const isAuth = require('../middelware/is-auth');
const router = express.Router();
const s3 = require('../s3');

const validators = {
    postDescription: body('description')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Missing post review description'),
    reactionType: body('reactionType')
        .exists()
        .isIn(['like', 'report', 'unLike', 'unReport'])
        .withMessage('Missing reaction type (like or report) '),
    commentContent: body('content')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Missing comment content'),
};

router.get('/', postController.getPosts);
router.get('/:postId', postController.getPostsById);
router.get('/hashtag/:hashName', postController.getPostsByHashtag);
router.delete('/:postId', isAuth, postController.deletePost);
router.post('/', isAuth, validators.postDescription, postController.createPost);
router.put('/:postId/reaction', isAuth, validators.reactionType, postController.addReactionToPost,);
router.delete('/:postId/reaction/:reactionId', isAuth, postController.deleteReaction,);
router.put('/:postId/comment', isAuth, validators.commentContent, postController.addCommentToPost,);
router.post('/post-pic', isAuth, s3.upload.single('post-image'), postController.getNewPostImage,);
router.delete('/post-pic/:imageKey', isAuth, postController.deleteImageFromBucket,);

module.exports = router;
