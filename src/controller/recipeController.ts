import { Types } from "mongoose";
import { Recipe, RecipeInput } from "../models/recipeModel"

import { NextFunction, Request, Response, Router } from 'express';
import recipeService from "../services/recipeService";

const recipesRouter = Router();

export const getAllRecipes = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const recipes = await recipeService.getAllRecipes();
    // const recipes = await Recipe.find({});
    res.status(200).send(recipes);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
};

export const getRecipe = async (req: Request<{ id: string; }, {}, {}>, res: Response) => {
  const { params } = req;

  try {
     // attempting to cast first will give a better error
    const recipe = await recipeService.getRecipe(params.id);
    console.log("recipe is", recipe);
    return res.status(200).send(recipe);
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
};

recipesRouter.post('/', async (req: Request<{}, {}, RecipeInput>, res: Response) => {

  const { body } = req;
  console.log('creating a recipe!');

  console.log(body);

  const newRecipe = new Recipe({
    name: body.name,
    description: body.description,
    tags: body.tags,
    ingredients: body.ingredients,
    instructions: body.instructions,
    notes: body.notes,
  });

  try {
    const savedRecipe = await newRecipe.save();
    res.status(200).send(savedRecipe);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});

recipesRouter.get('/', getAllRecipes);
recipesRouter.get('/:id', getRecipe);

recipesRouter.put('/:id', async (req: Request<{id: string}, {}, RecipeInput>, res: Response) => {
  const { params, body } = req;
  
  try {
    const id = Types.ObjectId.createFromHexString(params.id);
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id, body,
      { new: true, runValidators: true, context: 'query' }
    );

    res.status(200).send(updatedRecipe);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});

recipesRouter.delete('/:id', async (req, res) => {
  const { params } = req;
  // const recipe = await Recipe.findById(id);

  // if (user._id.toString() !== blogToDelete.user.toString()) {
  //   return response.status(401).json({
  //     'error': 'unauthorized'
  //   })
  // }
  try {
    const id = Types.ObjectId.createFromHexString(params.id); // attempting to cast first will give a better error
    await Recipe.findByIdAndRemove(id)
    res.sendStatus(204);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});


export default recipesRouter;

// blogsRouter.get('/', async (request, response) => {
//   await Blog.find({}).populate(
//     'user', { username: 1, name: 1 },
//   )
//   const blogs = await Blog.find({}).populate(
//     'comments', { message: 1 },
//   )
//   return response.json(blogs)
// })

// blogsRouter.get('/:id', async (request, response) => {
//   const { user, params } = request
//   const blog = await Blog.findById(params.id)

//   return response.json(blog)
// })


// blogsRouter.post('/', userExtractor, async (request, response) => {
//   const { body, user } = request
  
//   const blog = new Blog({
//     title: body.title,
//     author: body.author,
//     url: body.url,
//     likes: body.likes || 0,
//     user: user._id,
//     comments: []
//   })

//   if (body.title && body.author) {
//     const savedBlog = await blog.save()
//     user.blogs = user.blogs.concat(savedBlog._id)
//     await user.save()

//     response.status(201).json(savedBlog)
//   } else {
//     response.status(400).end()
//   }
// })

// blogsRouter.delete('/:id', userExtractor, async (request, response) => {

//   const { user, params } = request
//   const blogToDelete = await Blog.findById(params.id)

//   if (user._id.toString() !== blogToDelete.user.toString()) {
//     return response.status(401).json({
//       'error': 'unauthorized'
//     })
//   }

//   await Blog.findByIdAndRemove(params.id)
//   response.status(204).end()
// })

// blogsRouter.put('/:id', async (request, response) => {
//   const body = request.body

//   const updatedBlog = await Blog.findByIdAndUpdate(
//     request.params.id,
//     body,
//     { new: true, runValidators: true, context: 'query' }
//   )
//   response.json(updatedBlog)
// })

// module.exports = blogsRouter

