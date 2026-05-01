const Chef = require("../models/chef.model");

const parseJsonField = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  return JSON.parse(value);
};

const createChefProfile = async (payload) => {
  const { userId, name, bio, speciality, cuisineType, socialLinks } = payload;

  return Chef.create({
    userId,
    name,
    bio,
    speciality: parseJsonField(speciality, []),
    cuisineType: parseJsonField(cuisineType, []),
    socialLinks: parseJsonField(socialLinks, {}),
  });
};

const getChefByUserId = async (userId) => {
  return Chef.findOne({ userId });
};

const getAllChefs = async ({ page = 1, limit = 12 } = {}) => {
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const chefs = await Chef.find()
    .select("name bio profilePhoto speciality cuisineType totalRecipes isVerified rating ratingCount")
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .sort({ createdAt: -1 });

  const total = await Chef.countDocuments();

  return {
    chefs,
    totalPages: Math.ceil(total / limitNumber),
    currentPage: pageNumber,
  };
};

const getChefById = async (id) => {
  return Chef.findById(id).populate("userId", "email");
};

const updateChefProfile = async (chef, payload) => {
  const { name, bio, speciality, cuisineType, socialLinks } = payload;

  if (name !== undefined) chef.name = name;
  if (bio !== undefined) chef.bio = bio;
  if (speciality !== undefined) chef.speciality = parseJsonField(speciality, chef.speciality);
  if (cuisineType !== undefined) chef.cuisineType = parseJsonField(cuisineType, chef.cuisineType);
  if (socialLinks !== undefined) chef.socialLinks = parseJsonField(socialLinks, chef.socialLinks);

  await chef.save();
  return chef;
};

const updateProfilePhoto = async (chef, profilePhoto) => {
  chef.profilePhoto = profilePhoto;
  await chef.save();
  return chef.profilePhoto;
};

const addAchievement = async (chef, achievement) => {
  chef.achievements.push(achievement);
  await chef.save();
  return chef.achievements;
};

const deleteAchievement = async (chef, achievementId) => {
  chef.achievements = chef.achievements.filter(
    (achievement) => achievement._id.toString() !== achievementId
  );

  await chef.save();
  return chef.achievements;
};

const rateChef = async (chef, userId, value) => {
  const ratingValue = Number(value);

  if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    throw new Error("Rating must be a whole number from 1 to 5");
  }

  const existingRating = chef.ratings.find(
    (rating) => rating.userId.toString() === userId
  );

  if (existingRating) {
    existingRating.value = ratingValue;
  } else {
    chef.ratings.push({ userId, value: ratingValue });
  }

  const total = chef.ratings.reduce((sum, rating) => sum + rating.value, 0);
  chef.ratingCount = chef.ratings.length;
  chef.rating = chef.ratingCount ? Number((total / chef.ratingCount).toFixed(1)) : 0;

  await chef.save();
  return chef;
};

const deleteChef = async (chef) => {
  await chef.deleteOne();
};

module.exports = {
  createChefProfile,
  getChefByUserId,
  getAllChefs,
  getChefById,
  updateChefProfile,
  updateProfilePhoto,
  addAchievement,
  deleteAchievement,
  rateChef,
  deleteChef,
};
