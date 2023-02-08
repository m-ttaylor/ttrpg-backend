import { Types } from "mongoose";
import { EditRecipeInput, Recipe, RecipeInput } from "../models/recipeModel"

import { Request, Response, Router } from 'express';
import recipeService from "../services/recipeService";
import { CreateRecipeRequest, CreateRecipeResponse, DeleteRecipeResponse, RecipeResponse, UpdateRecipeResponse } from "../types/types";

const recipesRouter = Router();

export const getAllRecipesHandler = async (req: Request, res: Response) => {

  let recipes: RecipeResponse[] | null;

  try {
    recipes = await recipeService.getAllRecipes();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }

  if (recipes) {
    return res.status(200).send(recipes);
  } else {
    return res.sendStatus(404);
  }
};


export const getRecipeHandler = async (req: Request<{ id: string; }, {}, {}>, res: Response) => {
  const { params } = req;

  let recipe: RecipeResponse;
  try {
    recipe = await recipeService.getRecipe(params.id);
  } catch (e: any) {
    return res.status(400).send(e.message);
  }

  if (recipe) {
    return res.status(200).json(recipe);
  } else {
    return res.status(404).send("recipe not found");
  }
};

export const createRecipeHandler = async (req: Request<{}, {}, CreateRecipeRequest>, res: Response) => {

  const { body } = req;
  console.log('attempting to create a recipe...');

  let createdRecipeResponse: CreateRecipeResponse; 

  try {
    createdRecipeResponse = await recipeService.createRecipe(body);
  } catch (e: any) {
    console.log('recipe creation failed unexpectedly');
    return res.status(400).send(e.message)
  }

  if (createdRecipeResponse.result === "success") {
    console.log('recipe creation succeeded');
    return res.status(201).send(createdRecipeResponse);
  } else {
    console.log('recipe creation failed');
    return res.status(400).send("Failed to create recipe")
  }
};

export const editRecipeHandler = async (req: Request<{id: string}, {}, EditRecipeInput>, res: Response) => {
  const { params, body } = req;
  
  let editRecipeResponse: UpdateRecipeResponse;

  try {
    const id: Types.ObjectId = new Types.ObjectId(params.id);
    editRecipeResponse = await recipeService.editRecipe(id, body);
  } catch (e: any) {
    if (e instanceof TypeError) {
      return res.status(400).send(e.message);
    }
    console.log("DEBUG: we hit this?")
    console.log(e.message);
    return res.status(400).send(e.message);
  }

  if (editRecipeResponse.result === "success") {
    return res.status(200).send(editRecipeResponse);
  } else {
    return res.status(404).send("failed to edit recipe: recipe does not exist");
  }
}

export const deleteRecipeHandler = async (req: Request, res: Response) => {
  const { params } = req;
  let response: DeleteRecipeResponse;

  try {
    response = await recipeService.deleteRecipe(params.id);
  } catch (e: any) {
    return res.status(400).send(e.message);
  }

  if (response.result === "success") {
    return res.sendStatus(204);
  } else {
    return res.status(400).send("failed to delete recipe");
  }
};

recipesRouter.get('/', getAllRecipesHandler);
recipesRouter.get('/:id', getRecipeHandler);
recipesRouter.post('/', createRecipeHandler);
recipesRouter.put('/:id', editRecipeHandler);
recipesRouter.delete('/:id', deleteRecipeHandler);

export default recipesRouter;
