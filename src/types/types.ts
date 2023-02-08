import { EditRecipeInput } from "../models/recipeModel";

type StrictPropertyCheck<T, TExpected, TError> =
  Exclude<keyof T, keyof TExpected> extends never ? {} : TError;
interface EditRecipeError extends TypeError { }

export type StrictEditRecipeRequest<T> = T &
  StrictPropertyCheck<T, EditRecipeInput, EditRecipeError>

export type ResultStatus = "success" | "failure"

export type CreateRecipeRequest = {
  name: string;
  tags: string;
  ingredients: string;
  instructions: string;
  notes?: string;
  description?: string;
}

export type UpdateRecipeRequest = Omit<RecipeItem, "_id" | "__v">

export type RecipeItem = {
  _id?: string;
  name?: string | undefined;
  description?: string | null | undefined;
  tags?: string | undefined;
  ingredients?: string | undefined;
  instructions?: string | undefined;
  notes?: string | null | undefined;
  __v?: number;
}

export type RecipeResponse = RecipeItem & {
  createdAt?: string;
  updatedAt?: string;
} | null

export type CreateRecipeResponse = {
  result: ResultStatus
  response?: RecipeResponse
};

export type UpdateRecipeResponse = {
  result: ResultStatus;
  response?: RecipeResponse;
}

export type DeleteRecipeResponse = {
  result: ResultStatus;
  details?: any;
}