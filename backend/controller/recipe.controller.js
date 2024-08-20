import path from 'path';
import { fileURLToPath } from 'url';
import Recipe from '../models/recipe.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asynchandler.middleware.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc Create a new recipe
// @route POST /api/v1/recipes
// @access Private

const createRecipe = asyncHandler(async (req, res, next) => {
  const { title, description, category, ingredients, instructions, cookingTime } = req.body;
  const userOwner = req.user._id; // Assuming user is attached to req.user by auth middleware

  if (!title || !description || !ingredients || !instructions || !cookingTime) {
    return next(new ApiError(400, "Missing required fields"));
  }

  try {
    const newRecipe = await Recipe.create({
      title,
      description,
      category,
      ingredients,
      instructions,
      cookingTime,
      userOwner,
      creator: userOwner,
      recipeImg: req.file ? `/uploads/${req.file.filename}` : "", // Correctly reference the path
    });

    res.status(201).json({
      message: "Recipe created successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error('Error creating recipe:', error); // Log error for debugging
    next(new ApiError(500, 'Failed to create recipe'));
  }
});



// @desc Get all recipes
// @route GET /api/v1/recipes
// @access Public
const getRecipes = asyncHandler(async (req, res, next) => {
  try {
    const recipes = await Recipe.find().populate("userOwner", "name");

    // Convert image paths to Base64
    const recipesWithImages = await Promise.all(
      recipes.map(async (recipe) => {
        if (recipe.recipeImg) {
          try {
            const imagePath = path.join(__dirname, '..', '/', recipe.recipeImg);
            const imageData = fs.readFileSync(imagePath);
            recipe.recipeImg = `data:image/jpeg;base64,${imageData.toString('base64')}`;
          } catch (err) {
            console.error('Error reading image file:', err);
            recipe.recipeImg = null; // Handle the case where the image cannot be read
          }
        }
        return recipe;
      })
    );

    res.json(recipesWithImages);
  } catch (error) {
    console.error('Error fetching recipes:', error); // Log error for debugging
    next(new ApiError(500, 'Failed to fetch recipes'));
  }
});


// @desc Get a single recipe
// @route GET /api/v1/recipes/:id
// @access Public
const getRecipe = asyncHandler(async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    .populate({
      path: 'reviews.user', // Populate the user field in reviews
      select: 'name' // Only select the name field from the user
    });
    
    if (!recipe) {
      return next(new ApiError(404, "Recipe not found"));
    }

    // Read the image file and convert it to Base64
    if (recipe.recipeImg) {
      try {
        const imagePath = path.join(__dirname, '..', '/', recipe.recipeImg);
        const imageData = fs.readFileSync(imagePath);
        console.log(imageData);
        recipe.recipeImg = `data:image/jpeg;base64,${imageData.toString('base64')}`;
      } catch (err) {
        console.error('Error reading image file:', err);
        recipe.recipeImg = ''; // Handle the case where the image cannot be read
      }
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error); // Log error for debugging
    next(new ApiError(500, 'Failed to fetch recipe'));
  }
});


// @desc Update a recipe
// @route PUT /api/v1/recipes/:id
// @access Private
const updateRecipe = asyncHandler(async (req, res, next) => {
  try {
    console.log(`Updating recipe with ID: ${req.params.id}`); // Log the recipe ID
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      console.warn(`Recipe not found for ID: ${req.params.id}`); // Log if recipe not found
      return next(new ApiError(404, "Recipe not found"));
    }

    console.log(`User ${req.user._id} is attempting to update recipe owned by ${recipe.userOwner}`); // Log user and owner IDs

    if (recipe.userOwner.toString() !== req.user._id.toString()) {
      console.warn(`Unauthorized update attempt by user ${req.user._id} on recipe owned by ${recipe.userOwner}`); // Log unauthorized access attempt
      return next(new ApiError(403, "Not authorized to update this recipe"));
    }

    console.log(`Updating recipe data: ${JSON.stringify(req.body)}`); // Log the update data
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("userOwner", "name");

    if (updatedRecipe) {
      console.log(`Recipe with ID: ${req.params.id} updated successfully by user ${req.user._id}`); // Log success
      res.json({
        message: "Recipe updated successfully",
        recipe: updatedRecipe,
      });
    } else {
      console.error(`Failed to update recipe with ID: ${req.params.id}`); // Log if update fails
      next(new ApiError(500, 'Failed to update recipe'));
    }
  } catch (error) {
    console.error(`Error updating recipe with ID: ${req.params.id}`, error); // Log error with recipe ID
    next(new ApiError(500, 'Failed to update recipe'));
  }
});


// @desc Delete a recipe
// @route DELETE /api/v1/recipes/:id
// @access Private
const deleteRecipe = asyncHandler(async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return next(new ApiError(404, "Recipe not found"));
    }
    if (recipe.userOwner.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, "Not authorized to delete this recipe"));
    }

    // Delete the recipe image file if it exists
    if (recipe.recipeImg) {
      const imagePath = path.join(__dirname, '..', recipe.recipeImg);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error('Error deleting recipe:', error); // Log error for debugging
    next(new ApiError(500, 'Failed to delete recipe'));
  }
});

// @desc Add review to a recipe
// @route POST /api/v1/recipes/:id/review
// @access Private
const addReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return next(new ApiError(404, "Recipe not found"));
    }

    if (!rating || !comment) {
      return next(new ApiError(400, "Rating and comment are required"));
    }

    const review = {
      name: req.user.name,
      rating,
      comment,
      user: req.user._id, // Reference to the user
    };

    recipe.reviews.push(review);
    recipe.numReviews = recipe.reviews.length;
    recipe.rating =
      recipe.reviews.reduce((acc, review) => review.rating + acc, 0) /
      recipe.reviews.length;
    await recipe.save();

    res.json({
      message: "Review added successfully",
      recipe,
    });
  } catch (error) {
    console.error('Error adding review:', error); // Log error for debugging
    next(new ApiError(500, 'Failed to add review'));
  }
});

// @desc Get reviews of a recipe
// @route GET /api/v1/recipes/:id/reviews
// @access Public
const getReviews = asyncHandler(async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("reviews.user", "name");
    if (!recipe) {
      return next(new ApiError(404, "Recipe not found"));
    }
    res.json(recipe.reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error); // Log error for debugging
    next(new ApiError(500, 'Failed to fetch reviews'));
  }
});

// @desc Get recipes created by the logged-in user
// @route GET /api/v1/recipes/my-recipes
// @access Private
const getUserRecipes = asyncHandler(async (req, res, next) => {
  try {
    const userRecipes = await Recipe.find({ userOwner: req.user._id }).populate("userOwner", "name");

    // Process each recipe to include the Base64 image
    const recipesWithImages = await Promise.all(userRecipes.map(async (recipe) => {
      if (recipe.recipeImg) {
        try {
          const imagePath = path.join(__dirname, '..', '/', recipe.recipeImg);
          const imageData = fs.readFileSync(imagePath);
          recipe.recipeImg = `data:image/jpeg;base64,${imageData.toString('base64')}`;
        } catch (err) {
          console.error('Error reading image file:', err);
          recipe.recipeImg = ''; // Handle the case where the image cannot be read
        }
      }
      return recipe;
    }));

    res.json(recipesWithImages);
  } catch (error) {
    console.error('Error fetching user recipes:', error); // Log error for debugging
    next(new ApiError(500, 'Failed to fetch user recipes'));
  }
});


export {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  addReview,
  getReviews,
  getUserRecipes,
  
};
