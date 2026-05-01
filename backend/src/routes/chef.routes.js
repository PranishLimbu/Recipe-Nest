const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/chef.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");


// Public
router.get("/", getAllChefs);

// Chef only
router.post("/", protect, authorizeRoles("chef"), createChefProfile);
router.get("/me", protect, authorizeRoles("chef"), getMyProfile);
router.put("/me", protect, authorizeRoles("chef"), updateChefProfile);
router.put("/me/photo", protect, authorizeRoles("chef"), upload.single("profilePhoto"), uploadProfilePhoto);
router.post("/me/achievements", protect, authorizeRoles("chef"), addAchievement);
router.delete("/me/achievements/:achievementId", protect, authorizeRoles("chef"), deleteAchievement);

// Signed-in users
router.post("/:id/rating", protect, rateChef);

// Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteChef);

// Public by id
router.get("/:id", getChefById);

module.exports = router;
