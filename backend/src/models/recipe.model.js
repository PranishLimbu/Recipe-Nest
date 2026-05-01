const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    recipeId: {
      type: Number,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    image: {
      url: {
        type: String,
        default: "",
        trim: true,
      },
      publicId: {
        type: String,
        default: "",
        trim: true,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to User model
      required: true,
    },
  },
  { timestamps: true }
);

recipeSchema.index({ title: "text", description: "text", ingredients: "text" });

module.exports = mongoose.model("Recipe", recipeSchema);
