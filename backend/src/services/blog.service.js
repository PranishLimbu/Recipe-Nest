const mongoose = require("mongoose");
const Blog = require("../models/blog.model");
const { getNextSequence } = require("../utils/counter.util");

const buildBlogFilters = (query = {}) => {
  const { q, status, userId, tag } = query;
  const filters = {};

  if (q) {
    filters.$text = { $search: q };
  }

  if (status) {
    filters.status = status;
  }

  if (tag) {
    filters.tags = tag;
  }

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    filters.userId = userId;
  }

  return filters;
};

const normalizeBlogPayload = (payload = {}, { isUpdate = false } = {}) => {
  const normalizedPayload = { ...payload };

  if (Array.isArray(payload.tags)) {
    normalizedPayload.tags = payload.tags;
  } else if (!isUpdate) {
    normalizedPayload.tags = [];
  } else {
    delete normalizedPayload.tags;
  }

  if (payload.coverImage) {
    normalizedPayload.coverImage = payload.coverImage;
  } else if (!isUpdate) {
    normalizedPayload.coverImage = {
      url: "",
      publicId: "",
    };
  } else {
    delete normalizedPayload.coverImage;
  }

  return normalizedPayload;
};

const getAllBlogs = async (query = {}) => {
  const filters = buildBlogFilters(query);
  return Blog.find(filters).sort({ createdAt: -1 });
};

const getBlogById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Blog.findById(id);
  }

  const numericBlogId = Number(id);

  if (Number.isInteger(numericBlogId) && numericBlogId > 0) {
    return Blog.findOne({ blogId: numericBlogId });
  }

  return null;
};

const createBlog = async (newBlog) => {
  const blogId = await getNextSequence("blogId", Blog, "blogId");
  return Blog.create({ ...normalizeBlogPayload(newBlog), blogId });
};

const updateBlog = async (id, updatedData) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Blog.findByIdAndUpdate(id, normalizeBlogPayload(updatedData, { isUpdate: true }), {
      new: true,
      runValidators: true,
    });
  }

  const numericBlogId = Number(id);

  if (Number.isInteger(numericBlogId) && numericBlogId > 0) {
    return Blog.findOneAndUpdate(
      { blogId: numericBlogId },
      normalizeBlogPayload(updatedData, { isUpdate: true }),
      {
        new: true,
        runValidators: true,
      }
    );
  }

  return null;
};

const deleteBlog = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Blog.findByIdAndDelete(id);
  }

  const numericBlogId = Number(id);

  if (Number.isInteger(numericBlogId) && numericBlogId > 0) {
    return Blog.findOneAndDelete({ blogId: numericBlogId });
  }

  return null;
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
