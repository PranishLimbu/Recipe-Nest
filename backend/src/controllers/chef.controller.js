const chefService = require("../services/chef.service");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const createChefProfile = async (req, res) => {
  try {
    const existing = await chefService.getChefByUserId(req.user.id);
    if (existing) return res.status(400).json({ message: "Chef profile already exists" });

    const chef = await chefService.createChefProfile({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json({ message: "Chef profile created", chef });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllChefs = async (req, res) => {
  try {
    const result = await chefService.getAllChefs(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getChefById = async (req, res) => {
  try {
    const chef = await chefService.getChefById(req.params.id);
    if (!chef) return res.status(404).json({ message: "Chef not found" });
    res.status(200).json({ chef });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const chef = await chefService.getChefByUserId(req.user.id);
    if (!chef) return res.status(404).json({ message: "Chef profile not found" });
    res.status(200).json({ chef });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateChefProfile = async (req, res) => {
  try {
    const chef = await chefService.getChefByUserId(req.user.id);
    if (!chef) return res.status(404).json({ message: "Chef profile not found" });

    await chefService.updateChefProfile(chef, req.body);
    res.status(200).json({ message: "Profile updated", chef });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const chef = await chefService.getChefByUserId(req.user.id);
    if (!chef) return res.status(404).json({ message: "Chef profile not found" });

    if (chef.profilePhoto.publicId) {
      await cloudinary.uploader.destroy(chef.profilePhoto.publicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "recipenest/chefs",
      transformation: [{ width: 500, height: 500, crop: "fill" }],
    });

    fs.unlinkSync(req.file.path);

    const photo = await chefService.updateProfilePhoto(chef, {
      url: result.secure_url,
      publicId: result.public_id,
    });

    res.status(200).json({ message: "Profile photo updated", photo });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addAchievement = async (req, res) => {
  try {
    const chef = await chefService.getChefByUserId(req.user.id);
    if (!chef) return res.status(404).json({ message: "Chef profile not found" });

    const { title, description, year } = req.body;
    if (!title) return res.status(400).json({ message: "Achievement title is required" });

    const achievements = await chefService.addAchievement(chef, { title, description, year });

    res.status(201).json({ message: "Achievement added", achievements });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const chef = await chefService.getChefByUserId(req.user.id);
    if (!chef) return res.status(404).json({ message: "Chef profile not found" });

    const achievements = await chefService.deleteAchievement(chef, req.params.achievementId);
    res.status(200).json({ message: "Achievement deleted", achievements });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const rateChef = async (req, res) => {
  try {
    const chef = await chefService.getChefById(req.params.id);
    if (!chef) return res.status(404).json({ message: "Chef not found" });

    const updatedChef = await chefService.rateChef(chef, req.user.id, req.body.rating);
    res.status(200).json({
      message: "Rating saved",
      rating: updatedChef.rating,
      ratingCount: updatedChef.ratingCount,
      chef: updatedChef,
    });
  } catch (error) {
    const statusCode = error.message.includes("Rating must") ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

const deleteChef = async (req, res) => {
  try {
    const chef = await chefService.getChefById(req.params.id);
    if (!chef) return res.status(404).json({ message: "Chef not found" });

    if (chef.profilePhoto.publicId) {
      await cloudinary.uploader.destroy(chef.profilePhoto.publicId);
    }

    await chefService.deleteChef(chef);
    res.status(200).json({ message: "Chef profile deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createChefProfile,
  getAllChefs,
  getChefById,
  getMyProfile,
  updateChefProfile,
  uploadProfilePhoto,
  addAchievement,
  deleteAchievement,
  rateChef,
  deleteChef,
};
