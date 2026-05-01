const blogService = require("../services/blog.service");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { parseArrayField } = require("../utils/multipart.util");

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs(req.query);
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBlog = async (req, res) => {
  try {
    let coverImage = undefined;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "recipenest/blogs",
        transformation: [{ width: 1400, height: 900, crop: "limit" }],
      });

      coverImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      fs.unlinkSync(req.file.path);
    }

    const newBlog = await blogService.createBlog({
      ...req.body,
      tags: parseArrayField(req.body.tags),
      coverImage,
      userId: req.user.id,
    });

    res.status(201).json(newBlog);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({ error: err.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    let coverImage = undefined;
    const existingBlog = await blogService.getBlogById(req.params.id);

    if (!existingBlog) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.user.role !== "admin" && existingBlog.userId.toString() !== req.user.id) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: "You can only edit your own blogs" });
    }

    if (req.file) {
      if (existingBlog.coverImage?.publicId) {
        await cloudinary.uploader.destroy(existingBlog.coverImage.publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "recipenest/blogs",
        transformation: [{ width: 1400, height: 900, crop: "limit" }],
      });

      coverImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      fs.unlinkSync(req.file.path);
    }

    const updatedBlog = await blogService.updateBlog(req.params.id, {
      ...req.body,
      tags: req.body.tags !== undefined ? parseArrayField(req.body.tags) : undefined,
      coverImage,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({ error: err.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const existingBlog = await blogService.getBlogById(req.params.id);

    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.user.role !== "admin" && existingBlog.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own blogs" });
    }

    const deletedBlog = await blogService.deleteBlog(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (deletedBlog.coverImage?.publicId) {
      await cloudinary.uploader.destroy(deletedBlog.coverImage.publicId);
    }

    res.json({ message: "Blog deleted successfully", blog: deletedBlog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
