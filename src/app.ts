import express from 'express';
import config from 'config';
import cors from 'cors';

import connect from './utils/connect';
import recipeRouter from './controller/recipeController';

const port = config.get<number>('port');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/recipes', recipeRouter)

app.listen(port, async () => {
  await connect();
});

export default app;