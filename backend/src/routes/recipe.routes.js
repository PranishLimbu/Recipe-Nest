const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipeById);
router.post("/", protect, upload.single("image"), recipeController.createRecipe);
router.put("/:id", protect, upload.single("image"), recipeController.updateRecipe);
router.delete("/:id", protect, recipeController.deleteRecipe);

module.exports = router;
