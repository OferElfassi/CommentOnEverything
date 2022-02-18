const express = require("express");
const userController = require("../controllers/user-controller");
const isAuth = require("../middelware/is-auth");
const s3 = require('../s3')
const router = express.Router();

router.get("/",isAuth, userController.getUsers);
router.get("/:userId", userController.getUser);
router.delete("/:userId",isAuth, userController.deleteUser);
router.put("/:userId", isAuth, userController.updateUser);
router.post("/profile-pic", isAuth,s3.upload.single('profilePic'), userController.uploadProfilePic);


module.exports = router;
