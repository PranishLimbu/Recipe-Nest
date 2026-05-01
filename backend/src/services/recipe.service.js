const mongoose = require("mongoose");
const Recipe = require("../models/recipe.model");
const { getNextSequence } = require("../utils/counter.util");

const buildRecipeFilters = (query = {}) => {
  const { q, ingredient, userId } = query;
  const filters = {};

  if (q) {
    filters.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { ingredients: { $elemMatch: { $regex: q, $options: "i" } } },
    ];
  }

  if (ingredient) {
    const ingredientList = ingredient
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (ingredientList.length > 0) {
      filters.ingredients = {
        $all: ingredientList.map((item) => new RegExp(item, "i")),
      };
    }
  }

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    filters.userId = userId;
  }

  return filters;
};

const getAllRecipes = async (query = {}) => {
  const filters = buildRecipeFilters(query);
  return Recipe.find(filters).sort({ createdAt: -1 });
};

const getRecipeById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Recipe.findById(id);
  }

  const numericRecipeId = Number(id);

  if (Number.isInteger(numericRecipeId) && numericRecipeId > 0) {
    return Recipe.findOne({ recipeId: numericRecipeId });
  }

  return null;
};

const createRecipe = async (newRecipe) => {
  const recipeId = await getNextSequence("recipeId", Recipe, "recipeId");
  return Recipe.create({ ...newRecipe, recipeId });
};

const normalizeRecipePayload = (payload = {}, { isUpdate = false } = {}) => {
  const normalizedPayload = { ...payload };

  if (Array.isArray(payload.ingredients)) {
    normalizedPayload.ingredients = payload.ingredients;
  } else if (!isUpdate) {
    normalizedPayload.ingredients = [];
  } else {
    delete normalizedPayload.ingredients;
  }

  if (payload.image) {
    normalizedPayload.image = payload.image;
  } else if (!isUpdate) {
    normalizedPayload.image = {
      url: "",
      publicId: "",
    };
  } else {
    delete normalizedPayload.image;
  }

  return normalizedPayload;
};

const updateRecipe = async (id, updatedData) => {
  const payload = normalizeRecipePayload(updatedData, { isUpdate: true });

  if (mongoose.Types.ObjectId.isValid(id)) {
    return Recipe.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  const numericRecipeId = Number(id);

  if (Number.isInteger(numericRecipeId) && numericRecipeId > 0) {
    return Recipe.findOneAndUpdate({ recipeId: numericRecipeId }, payload, {
      new: true,
      runValidators: true,
    });
  }

  return null;
};

const deleteRecipe = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Recipe.findByIdAndDelete(id);
  }

  const numericRecipeId = Number(id);

  if (Number.isInteger(numericRecipeId) && numericRecipeId > 0) {
    return Recipe.findOneAndDelete({ recipeId: numericRecipeId });
  }

  return null;
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
