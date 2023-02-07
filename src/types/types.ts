export interface RecipeResponse {
  _id?: string;
  name?: string | undefined;
  description?: string | null | undefined;
  tags?: string | undefined;
  ingredients?: string | undefined;
  instructions?: string | undefined;
  notes?: string | null | undefined;
  // createdAt: Date;
  // updatedAt: Date;
  __v?: number;
}