const express = require('express');
const userController = require('../controllers/user-controller');
const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:userId', userController.getUser);
router.delete('/:userId', userController.deleteUser);
router.put('/:userId', userController.deleteUser);

module.exports = router;
