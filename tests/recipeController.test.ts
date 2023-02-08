import recipeService from "../src/services/recipeService";
import { CreateRecipeResponse, RecipeResponse } from "../src/types/types";
import { getRecipeHandler, getAllRecipesHandler, createRecipeHandler, editRecipeHandler, deleteRecipeHandler } from "../src/controller/recipeController";


const notFoundTestRecipe: RecipeResponse = null;

const BSONTypeErrorMessage = "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer";

const testCreateRecipeRequest = {
  "name":"baked feta",
  "tags":"cheese",
  "ingredients":"feta 400g",
  "instructions":"Put feta in the oven directly on the racks and bake for 15 minutes at 425 F"
}

const testBadEditRecipeRequest = {
  "foo": "bar"
}

const testEditRecipeRequest = {
  "name": "baked feta",
  "description": "",
  "tags": "cheese, baking, appetizers",
  "ingredients": "feta\npuff pastry\njam",
  "instructions": "Put feta in the oven directly on the racks and bake for 15 minutes at 425 F",
  "notes": ""
}

const testFailedCreateRecipeResponse: CreateRecipeResponse = { result: "failure" };

const testBadCreateRecipeRequest = {
  // missing name field
  "tags":"cheese",
  "ingredients":"feta 400g",
  "instructions":"Put feta in the oven directly on the racks and bake for 15 minutes at 425 F"
}

const testCreateRecipeResponse: CreateRecipeResponse = {
  result: "success",
  response: {
    "name": "baked feta",
    "description": null,
    "tags": "cheese",
    "ingredients": "feta 400g",
    "instructions": "Put feta in the oven directly on the racks and bake for 15 minutes at 425 F",
    "notes": null,
    "_id": "63e2a8235fea67838fa34134",
    // "createdAt": new Date("2023-02-07T19:36:03.510Z"),
    "createdAt": "2023-02-07T19:36:03.510Z",
    // "updatedAt": new Date("2023-02-07T19:36:03.510Z"),
    "updatedAt": "2023-02-07T19:36:03.510Z",
    "__v": 0
  }
}

const testRecipe: RecipeResponse = {
  "_id": "63daaf922f298ddb0db690cf",
  "name": "mashed tomatoes",
  "description": "",
  "tags": "potatoes, side dishes",
  "ingredients": "<p>3 russet potatoes</p>\n",
  "instructions": "boil em, mash em",
  "notes": "",
  "__v": 0
}

const testRecipes: RecipeResponse[] = [testRecipe];

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


beforeEach(() => {
  jest.resetAllMocks();
});

test('getRecipeHanlder sends a 200 response and recipe when called with valid ID', async () => {
  
  const mockRequest: any = {
    params: { id: "63daaf922f298ddb0db690cf" }
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "getRecipe")
    .mockResolvedValueOnce(testRecipe);


  await getRecipeHandler(mockRequest, mockResponse);
  expect(mockResponse.status).toHaveBeenCalledWith(200);
  expect(mockResponse.json).toHaveBeenCalledWith(testRecipe);
  
  expect(mockRecipeService).toHaveBeenCalledTimes(1);
  expect(mockRecipeService).toHaveBeenCalledWith(mockRequest.params.id);
});

test('getRecipeHanlder sends a 400 response and error when an error is thrown by recipeService', async () => {
  
  const mockRequest: any = {
    params: { id: "63daaf922f298ddb0db690cf" }
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "getRecipe")
    .mockRejectedValueOnce(Error("unexpected recipeService.getRecipe error"));

  await getRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(400);
  expect(mockResponse.send).toHaveBeenCalledWith("unexpected recipeService.getRecipe error");

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
  expect(mockRecipeService).toHaveBeenCalledWith(mockRequest.params.id);
});

test('getRecipeHanlder sends a 404 response and error when called with an invalid ID', async () => {
  
  const mockRequest: any = {
    params: { id: "63daaf922f298ddb0db690cz" }
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "getRecipe")
    .mockResolvedValueOnce(notFoundTestRecipe);

  await getRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(404);
  expect(mockResponse.json).toHaveBeenCalledTimes(0);
  expect(mockResponse.send).toHaveBeenCalledWith("recipe not found");

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
  expect(mockRecipeService).toHaveBeenCalledWith(mockRequest.params.id);
});

test('getAllRecipesHandler sends a list of recipes', async () => {
  
  const mockRequest: any = {};

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "getAllRecipes").mockResolvedValueOnce(testRecipes);

  await getAllRecipesHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(200);
  expect(mockResponse.send).toHaveBeenCalledTimes(1);

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});

test('getAllRecipesHandler sends a 404 error when a null recipe responce is recieved', async () => {
  
  const mockRequest: any = {};

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "getAllRecipes").mockResolvedValueOnce(null);

  await getAllRecipesHandler(mockRequest, mockResponse);

  expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
  expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});

test('getAllRecipesHandler sends a 400 error when an error occurs', async () => {
  
  const mockRequest: any = {};

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "getAllRecipes").mockRejectedValueOnce(Error("Unexpected recipeService.getAllRecipes error"));

  await getAllRecipesHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(400);
  expect(mockResponse.send).toHaveBeenCalledTimes(1);

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});

test("createRecipeHandler sends a 201 response when called with valid recipe", async () => {
  const mockRequest: any = {
    body: testCreateRecipeRequest
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "createRecipe")
    .mockResolvedValueOnce(testCreateRecipeResponse);

  await createRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(201);
  expect(mockResponse.send).toHaveBeenCalledTimes(1);

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});

test("createRecipeHandler sends a 400 response when called with an invalid recipe", async () => {
  const mockRequest: any = {
    body: testBadCreateRecipeRequest
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "createRecipe")
    .mockResolvedValueOnce(testFailedCreateRecipeResponse);

  await createRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(400);
  expect(mockResponse.send).toHaveBeenCalledWith("Failed to create recipe")
  expect(mockResponse.send).toHaveBeenCalledTimes(1);

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});

test("createRecipeHandler sends a 400 response when an error is thrown by recipeService", async () => {
  const mockRequest: any = {
    body: testBadCreateRecipeRequest
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "createRecipe")
    .mockRejectedValueOnce(Error("unexpected recipeService.createRecipe error"));

  await createRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(400);
  expect(mockResponse.send).toHaveBeenCalledWith("unexpected recipeService.createRecipe error")
  expect(mockResponse.send).toHaveBeenCalledTimes(1);

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});

test("editRecipeHandler sends a 200 response when called with valid recipe", async () => {
  // note: mongoose editing as is allows us to include 0 - all fields, and fields not included will not be changed
  const mockRequest: any = {
    params: { id: "63daaf922f298ddb0db690cf" },
    body: testEditRecipeRequest
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "editRecipe")
    .mockResolvedValueOnce({result: "success"});

  await editRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(200);
  expect(mockResponse.send).toHaveBeenCalledTimes(1);

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});

test("editRecipeHandler sends a 400 response when called with an invalid id", async () => {
  // note: mongoose editing as is allows us to include 0 - all fields, and fields not included will not be changed
  const mockRequest: any = {
    params: { id: "65" }, // invalid id
    body: testEditRecipeRequest
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "editRecipe");

  await editRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledTimes(1);
  expect(mockResponse.status).toHaveBeenCalledWith(400);
  expect(mockResponse.send).toHaveBeenCalledTimes(1);
  expect(mockResponse.send).toHaveBeenCalledWith(BSONTypeErrorMessage);

  expect(mockRecipeService).toHaveBeenCalledTimes(0);
});


test("editRecipeHandler sends a 404 response when called with a valid id that does not exist", async () => {
  // note: mongoose editing as is allows us to include 0 - all fields, and fields not included will not be changed
  // it also allows extra fields, so we wont test that
  const mockRequest: any = {
    params: { id: "63daaf922f298ddb0db690cd" }, // valid but nonexistant id
    // body: testBadEditRecipeRequest
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "editRecipe")
    .mockResolvedValueOnce({result: "failure"});

  await editRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(404);
  expect(mockResponse.send).toHaveBeenCalledTimes(1);
  expect(mockResponse.send).toHaveBeenCalledWith("failed to edit recipe: recipe does not exist");

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});

test("editRecipeHandler sends a 400 response when an error occurs in recipeService", async () => {
  // note: mongoose editing as is allows us to include 0 - all fields, and fields not included will not be changed
  const mockRequest: any = {
    params: { id: "63daaf922f298ddb0db690cf" },
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "editRecipe")
    .mockRejectedValueOnce(Error("unexpected recipeService.editRecipe error"));

  await editRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(400);
  expect(mockResponse.send).toHaveBeenCalledTimes(1);
  // expect(mockResponse.send).toHaveBeenCalledWith("failed edit recipe: recipe does not exist");

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});

test("deleteRecipeHandler sends a 204 response when called with a valid ID", async () => {
  // note: mongoose editing as is allows us to include 0 - all fields, and fields not included will not be changed
  const mockRequest: any = {
    params: { id: "63daaf922f298ddb0db690cf" },
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "deleteRecipe")
    .mockResolvedValueOnce({result: "success"});

  await deleteRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
  // expect(mockResponse.send).toHaveBeenCalledTimes(1);

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});

test("deleteRecipeHandler sends a 400 response when called with a nonexistant ID", async () => {
  // note: mongoose editing as is allows us to include 0 - all fields, and fields not included will not be changed
  const mockRequest: any = {
    params: { id: "63daaf922f298ddb0db690cd" },
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "deleteRecipe")
    .mockResolvedValueOnce({result: "failure"});

  await deleteRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(400);
  expect(mockResponse.send).toHaveBeenCalledTimes(1);

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});

test("deleteRecipeHandler sends a 400 response when an error occurs in recipeService", async () => {
  // note: mongoose editing as is allows us to include 0 - all fields, and fields not included will not be changed
  const mockRequest: any = {
    params: { id: "63daaf922f298ddb0db690cd" },
  };

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
  };

  const mockRecipeService = jest.spyOn(recipeService, "deleteRecipe")
    .mockRejectedValueOnce(Error("unexpected recipeService.deleteRecipe error"));

  await deleteRecipeHandler(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(400);
  expect(mockResponse.send).toHaveBeenCalledTimes(1);

  expect(mockRecipeService).toHaveBeenCalledTimes(1);
});