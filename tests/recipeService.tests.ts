import recipeService from "../src/services/recipeService";
import { Recipe } from "../src/models/recipeModel";
import { Types } from "mongoose";
import { CreateRecipeRequest, CreateRecipeResponse, UpdateRecipeRequest, RecipeItem, RecipeResponse, UpdateRecipeResponse } from "../src/types/types";

const testRecipeId = "63daaf922f298ddb0db690cf"
const BSONTypeErrorMessage = "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer";

const testEditRecipeRequest: UpdateRecipeRequest = {
  "name": "baked feta",
  "description": "",
  "tags": "cheese, baking, appetizers",
  "ingredients": "feta\npuff pastry\njam",
  "instructions": "Put feta in the oven directly on the racks and bake for 15 minutes at 425 F",
  "notes": ""
}

const testCreateRecipeRequest: CreateRecipeRequest = {
  "name":"baked grapes",
  "tags":"abominations",
  "ingredients":"1 1 lb bag of grapes",
  "instructions":"Put grapes in the oven directly on the racks and bake for 15 minutes at 425 F"
}

const saveResponse: RecipeResponse = {
  "name": "baked grapes",
  "description": null,
  "tags": "sadfds",
  "ingredients": "sfdsafsdds",
  "instructions": "Put grapes in the oven directly on the racks and bake for 15 minutes at 425 F",
  "notes": null,
  "_id": "63e2c7e9f170e0864b574814",
  "createdAt": "2023-02-07T21:51:37.921Z",
  "updatedAt": "2023-02-07T21:51:37.921Z",
  "__v": 0
}

const findByIdAndUpdateResponse: RecipeResponse = {
  "name": "baked grapes",
  "description": null,
  "tags": "sadfds",
  "ingredients": "sfdsafsdds",
  "instructions": "Put grapes in the oven directly on the racks and bake for 15 minutes at 425 F",
  "notes": null,
  "_id": "63e2c7e9f170e0864b574814",
  "createdAt": "2023-02-07T21:51:37.921Z",
  "updatedAt": "2023-02-07T21:51:37.921Z",
  "__v": 0
}

const expectedEditRecipeResponse: UpdateRecipeResponse = {
  "result": "success",
  "response": findByIdAndUpdateResponse
}

const expectedCreateRecipeResponse: CreateRecipeResponse = {
  "result": "success",
  "response": saveResponse
}

const testRecipe: RecipeItem = {
  "_id": "63daaf922f298ddb0db690cf",
  "name": "mashed tomatoes",
  "description": "",
  "tags": "potatoes, side dishes",
  "ingredients": "<p>3 russet potatoes</p>\n",
  "instructions": "boil em, mash em",
  "notes": "",
  "__v": 0
}

const testRecipes = [testRecipe];

beforeEach(() => {
  jest.resetAllMocks();
});

test("getAllRecipes returns all reicpes", async () => {

  const mockFind = jest.spyOn(Recipe, "find")
    .mockResolvedValueOnce(testRecipes);
  
  const result = await recipeService.getAllRecipes();
  expect(result).toBe(testRecipes);
  expect(mockFind).toHaveBeenCalledTimes(1);
})

test("getRecipe returns a recipe", async () => {

  const mockFindById = jest.spyOn(Recipe, "findById")
    .mockResolvedValueOnce(testRecipe);
    
  expect(recipeService.getRecipe(testRecipeId)).resolves.toBe(testRecipe);
  expect(mockFindById).toHaveBeenCalledWith(Types.ObjectId.createFromHexString(testRecipeId));
  expect(mockFindById).toHaveBeenCalledTimes(1);
})

test("createRecipe returns success", async () => {

  const mockSave = jest.spyOn(Recipe.prototype, "save")
    .mockResolvedValueOnce(saveResponse);
  
  expect(recipeService.createRecipe(testCreateRecipeRequest)).resolves.toStrictEqual(expectedCreateRecipeResponse);
  // expect(mockSave).toHaveBeenCalledWith(createRecipeRequest); // won't work here
  expect(mockSave).toHaveBeenCalledTimes(1);
})

test("createRecipe returns error when mongoose throws an error while saving", async () => {
  const mockSave = jest.spyOn(Recipe.prototype, "save")
    .mockRejectedValueOnce(Error("Recipe validation failed: name: Path `name` is required."));

  expect(recipeService.createRecipe(testCreateRecipeRequest)).resolves.toEqual({ result: "failure" });
  expect(mockSave).toHaveBeenCalledTimes(1);
})

test("editRecipe returns successful response when called on a valid id", async () => {
  const mockFindByIdAndUpdate = jest.spyOn(Recipe, "findByIdAndUpdate")
    .mockResolvedValueOnce(findByIdAndUpdateResponse);
  
  expect(recipeService.editRecipe(testRecipeId, testEditRecipeRequest))
    .resolves.toEqual(expectedEditRecipeResponse);
  expect(mockFindByIdAndUpdate).toBeCalledTimes(1);
  expect(mockFindByIdAndUpdate).toBeCalledWith(
    testRecipeId,
    testEditRecipeRequest,
    { new: true, runValidators: true, context: 'query' }
  );
})

test("editRecipe returns failure response when id is not a valid ObjectId", async () => {
  const mockFindByIdAndUpdate = jest.spyOn(Recipe, "findByIdAndUpdate");

  expect(recipeService.editRecipe("invalid id", testEditRecipeRequest))
    .resolves.toEqual({result: "failure", error: BSONTypeErrorMessage });
  expect(mockFindByIdAndUpdate).toBeCalledTimes(0);
})


test("editRecipe returns failure response when findByIdAndUpdate returns null", async () => {
  const mockFindByIdAndUpdate = jest.spyOn(Recipe, "findByIdAndUpdate")
    .mockResolvedValueOnce(null);
  
  expect(recipeService.editRecipe(testRecipeId, testEditRecipeRequest))
    .resolves.toEqual({result: "failure", error: "Failed to edit recipe: recipe does not exist" });
  expect(mockFindByIdAndUpdate).toBeCalledTimes(1);
  expect(mockFindByIdAndUpdate).toBeCalledWith(
    testRecipeId,
    testEditRecipeRequest,
    { new: true, runValidators: true, context: 'query' }
  );
})

test("deleteRecipe returns success response when called on a valid ID", async () => {
  const mockFindByIdAndRemove = jest.spyOn(Recipe, "findByIdAndRemove")
    .mockResolvedValueOnce(findByIdAndUpdateResponse);
  
  expect(recipeService.deleteRecipe(testRecipeId)).resolves.toEqual({ result: "success" });
  expect(mockFindByIdAndRemove).toBeCalledTimes(1);
  expect(mockFindByIdAndRemove).toBeCalledWith(new Types.ObjectId(testRecipeId))
})

test("delete returns failures response when mongoose throws an error while removing", async () => {
  const mockFindByIdAndRemove = jest.spyOn(Recipe, "findByIdAndRemove")
    .mockResolvedValueOnce(null);
  
  expect(recipeService.deleteRecipe(testRecipeId)).resolves.toEqual({ result: "failure" });
  expect(mockFindByIdAndRemove).toBeCalledTimes(1);
  expect(mockFindByIdAndRemove).toBeCalledWith(new Types.ObjectId(testRecipeId));
})
