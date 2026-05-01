const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/", protect, upload.single("coverImage"), blogController.createBlog);
router.put("/:id", protect, upload.single("coverImage"), blogController.updateBlog);
router.delete("/:id", protect, blogController.deleteBlog);


module.exports = router;
