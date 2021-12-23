const express = require('express');
const postController = require('../controllers/post-controller');
const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:postId', postController.getPostsById);
router.get('/hashtag/:hashName', postController.getPostsByHashtag);
router.delete('/:postId', postController.deletePost);
router.post('/', postController.createPost);
router.put('/reaction/:postId', postController.addReactionToPost);
router.put('/comment/:postId', postController.addCommentToPost);

module.exports = router;
