const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {protect} = require("../middleware/auth.middleware");

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id",protect, userController.updateUser);
router.delete("/:id",protect, userController.deleteUser);

module.exports = router;