import { Query, Types } from "mongoose";
import { EditRecipeInput, Recipe, RecipeDocument, RecipeInput } from "../models/recipeModel"
import { RecipeResponse } from "../types/types";


const getAllRecipes = async () => {
  const recipes = await Recipe.find({});
  return recipes;
};

const getRecipe = async (id: string): Promise<RecipeResponse> => {
  const recipe = await Recipe.findById(Types.ObjectId.createFromHexString(id));

  const recipeResponse: RecipeResponse = { ...recipe };
  return recipeResponse;
}
export default { getAllRecipes, getRecipe };