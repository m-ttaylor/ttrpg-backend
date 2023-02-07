import mongoose, { Schema, Model, Document } from 'mongoose';

type RecipeDocument = Document & {
  name: string;
  description: string | null;
  tags: string;
  ingredients: string;
  instructions: string;
  notes: string | null;
};

type RecipeInput = {
  name: RecipeDocument['name'];
  description: RecipeDocument['description'];
  tags: RecipeDocument['tags'];
  ingredients: RecipeDocument['ingredients'];
  instructions: RecipeDocument['instructions'];
  notes: RecipeDocument['notes'];
};

type EditRecipeInput = RecipeInput & {
  name: RecipeDocument['_id'];
};

const recipeSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    description: {
      type: Schema.Types.String,
      default: null,
    },
    tags: {
      type: Schema.Types.String,
      required: true,
    },
    ingredients: {
      type: Schema.Types.String,
      required: true,
    },
    instructions: {
      type: Schema.Types.String,
      required: true,
    },
    notes: {
      type: Schema.Types.String,
      default: null,
    },
  },
  {
    collection: 'recipes',
    timestamps: true,
  },
);

const Recipe = mongoose.model<RecipeDocument>('Recipe', recipeSchema);

export { Recipe, RecipeInput, EditRecipeInput, RecipeDocument };