const express = require("express");
const userController = require("../controllers/user-controller");
const router = express.Router();
const isAuth = require("../middelware/is-auth");



router.get("/",isAuth, userController.getUsers);
router.get("/:userId", userController.getUser);
router.delete("/:userId",isAuth, userController.deleteUser);
router.put("/:userId", isAuth, userController.deleteUser);


module.exports = router;
