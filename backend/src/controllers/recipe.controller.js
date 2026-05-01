const recipeService = require("../services/recipe.service");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { parseArrayField } = require("../utils/multipart.util");

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await recipeService.getAllRecipes(req.query);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    let image = undefined;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "recipenest/recipes",
        transformation: [{ width: 1200, height: 900, crop: "limit" }],
      });

      image = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      fs.unlinkSync(req.file.path);
    }

    const newRecipe = await recipeService.createRecipe({
      ...req.body,
      ingredients: parseArrayField(req.body.ingredients),
      image,
      userId: req.user.id,
    });

    res.status(201).json(newRecipe);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({ error: err.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    let image = undefined;
    const existingRecipe = await recipeService.getRecipeById(req.params.id);

    if (!existingRecipe) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (req.user.role !== "admin" && existingRecipe.userId.toString() !== req.user.id) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: "You can only edit your own recipes" });
    }

    if (req.file) {
      if (existingRecipe.image?.publicId) {
        await cloudinary.uploader.destroy(existingRecipe.image.publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "recipenest/recipes",
        transformation: [{ width: 1200, height: 900, crop: "limit" }],
      });

      image = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      fs.unlinkSync(req.file.path);
    }

    const updatedRecipe = await recipeService.updateRecipe(req.params.id, {
      ...req.body,
      ingredients: req.body.ingredients !== undefined ? parseArrayField(req.body.ingredients) : undefined,
      image,
    });

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(updatedRecipe);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({ error: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const existingRecipe = await recipeService.getRecipeById(req.params.id);

    if (!existingRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (req.user.role !== "admin" && existingRecipe.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only delete your own recipes" });
    }

    const deletedRecipe = await recipeService.deleteRecipe(req.params.id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (deletedRecipe.image?.publicId) {
      await cloudinary.uploader.destroy(deletedRecipe.image.publicId);
    }

    res.json({ message: "Recipe deleted successfully", recipe: deletedRecipe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
