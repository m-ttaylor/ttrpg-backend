import recipeService from "../src/services/recipeService";
import { RecipeResponse } from "../src/types/types";
import recipesRouter, { getAllRecipes, getRecipe } from "../src/controller/recipeController";
// import app from "../src/app";

import { Request, Response } from "express";
// import request from "supertest";

const testRecipes: RecipeResponse[] = [{
  "_id": "63daaf922f298ddb0db690cf",
  "name": "mashed tomatoes",
  "description": "",
  "tags": "potatoes, side dishes",
  "ingredients": "<p>3 russet potatoes</p>\n",
  "instructions": "boil em, mash em",
  "notes": "",
  // "createdAt": {
  //   "$date": {
  //     "$numberLong": "1675276178883"
  //   }
  // },
  // "updatedAt": {
  //   "$date": {
  //     "$numberLong": "1675450912211"
  //   }
  // },
  "__v": 0
}];

// jest.mock("../src/controller/recipeController", () => {
//   // mockGetRecipe = 
//   const originalRecipeController = jest.requireActual("../src/controller/recipeController");

//   return {
//     __esModule: true,
//     ...originalRecipeController,
//     // default: jest.fn(() => "mocked"),
//     getAllRecipes: jest.fn(async () => testRecipes),
//     // getRecipe: jest.fn(async () => testRecipes[0]),
//   };
// });

// beforeAll(() => {
//   RecipeModel.find = jest.fn().mockResolvedValue([{
//           _id: '5dbff32e367a343830cd2f49',
//           name: 'Earth',
//           __v: 0
//       },
//       {
//           _id: '5dbff89209dee20b18091ec3',
//           name: 'Mars',
//           __v: 0
//       },
//   ])
// });

// test('use supertest', async () => {
//   const res = await request(app).get('/api/recipes');
//   console.log(res.body);

//   expect(true).toBe(true);
// });

test('getRecipe returns a recipe when called with valid ID', async () => {
  
  const mockRequest: any = {
    params: { id: "63daaf922f298ddb0db690cf" }
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "getRecipe").mockResolvedValueOnce(testRecipes[0]);

  // if we do this, the assertion passes, and I can see that the subsequent toHaveBeenCalledWith passes, 
  // which is progress
  // expect(getRecipe(mockRequest, mockResponse)).resolves.toBe(undefined);

  expect(getRecipe(mockRequest, mockResponse)).resolves.toBe(testRecipes[0]);

  // this also satisfies the toHaveBeenCalledWith check, but doesn't really test anything but the mock
  // expect(recipeService.getRecipe(mockRequest.params.id)).resolves.toBe(testRecipes[0]);

  expect(mockRecipeService).toHaveBeenCalledWith(mockRequest.params.id);
});

// test('recipeService does things', async () => {
//   // let spiedOn = 

//   // const result = getAllRecipes()
//   // await recipesRouter.get("/");
//   // await getAllRecipes();
//   // expect(mock)
//   // expect(getAllRecipes()).resolves.toEqual(2);
//   // expect(result).toBe(2);
//   const mockRequest: any = {
//     status: jest.fn(),
//     json: jest.fn(),
//   };
//   const mockResponse: any = {
//     status: jest.fn(),
//     json: jest.fn(),
//   };

//   const mockNext: any = jest.fn();

//   expect(getAllRecipes(mockRequest, mockResponse, mockNext)).resolves.toBe(testRecipes);
//   expect(getAllRecipes).toHaveBeenCalledTimes(1);
//   // expect(mockGetAllRecipes).toHaveBeenCalledTimes(1);
//   // jest.spyOn(recipeService, 'getAllRecipes').mockImplementationOnce(() => Promise.resolve(expected as any));

//   // const result = ;

//   // mockRecipeService();
//   // expect(mockRecipeService.mock.calls).toHaveLength(1);
//   // expect(mockRecipeService.mock.results[0].value).toBe(4);

//   // jest.spyOn(Recipe.prototype, 'find').mockImplementationOnce(() => Promise.resolve({}));
//   // (recipeService as jest.Mock).mockRejectedValue(new Error)
//   // recipeService.mock
  
  

//   // const mockNext: NextFunction = jest.fn();
  
//   // app.get
//   // recipesRouter.get("", mockResponse, mockNext);
//   // const response = await recipeService.getAllRecipes();
//   // expect(response).toEqual({});

  

//   // expect(mockResponse.json).toHaveBeenCalledTimes(1);
//   // expect(mockResponse.json).toHaveBeenCalledTimes(1);
//   // expect(mockResponse.status).toHaveBeenCalledTimes(1);
//   // expect(mockResponse.status).toHaveBeenCalledWith(200);

//   // expect(recipeService.getAllRecipes()).resolves.toEqual(expected);
// })
