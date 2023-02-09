import { Types } from "mongoose";
import { Recipe, RecipeDocument } from "../models/recipeModel"
import { CreateRecipeRequest, CreateRecipeResponse, DeleteRecipeResponse, UpdateRecipeRequest, RecipeResponse, UpdateRecipeResponse } from "../types/types";

const getAllRecipes = async (): Promise<RecipeResponse[] | null> => {
  const recipes = await Recipe.find({});
  const recipesResponse: RecipeResponse[] | null = recipes;
  return recipesResponse;
};

const getRecipe = async (id: string): Promise<RecipeResponse> => {
  const recipe = await Recipe.findById(Types.ObjectId.createFromHexString(id));
  const recipeResponse: RecipeResponse = recipe;
  return recipeResponse;
}
const createRecipe = async (body: CreateRecipeRequest): Promise<CreateRecipeResponse> => {
  let newRecipe: RecipeDocument;
  let savedRecipe: RecipeResponse;

  try {
    newRecipe = new Recipe({
      name: body.name,
      description: body.description,
      tags: body.tags,
      ingredients: body.ingredients,
      instructions: body.instructions,
      notes: body.notes,
    });
    savedRecipe = await newRecipe.save();

  } catch (e: any) {
    console.log("error occured while creating new recipe")
    return { result: "failure"};
  }

  const savedRecipeResponse: CreateRecipeResponse = { result: "success", response: savedRecipe };
  return savedRecipeResponse;
}

const editRecipe = async (id: string, body: UpdateRecipeRequest): Promise<UpdateRecipeResponse> => { 
  let objectId: Types.ObjectId;
  try {
    objectId = new Types.ObjectId(id);
  } catch (e: any) {
    // if (e instanceof TypeError) {
    // Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer
    return {
      result: "failure",
      error: e.message
    };
    // }
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    id, body,
    {
      new: true,
      runValidators: true,
      context: 'query'
    },
  );

  if (updatedRecipe) {
    return {
      result: "success",
      response: updatedRecipe
    }
  } else {
    return {
      result: "failure",
      error: "Failed to edit recipe: recipe does not exist"
    }
  }  
};

const deleteRecipe = async (id: string): Promise<DeleteRecipeResponse> => {
  const objectId = Types.ObjectId.createFromHexString(id); // attempting to cast first will give a better error
  const result = await Recipe.findByIdAndRemove(objectId);
  // const result: RecipeResponse = deletionResult;
  if (result) {
    return { result: "success"}
  } else {
    return { result: "failure"}
  }
}

export default { getAllRecipes, getRecipe, createRecipe, editRecipe, deleteRecipe };