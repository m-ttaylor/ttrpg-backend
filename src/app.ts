import express from 'express';
import config from 'config';
import cors from 'cors';

import connect from './utils/connect';
import logger from './utils/logger';
// import routes from './routes';
import { deserializeUser } from './middleware/deserializeUser';
import recipeRouter from './controller/recipeController';

const port = config.get<number>('port');
const app = express();

app.use(cors());
app.use(express.json());
app.use(deserializeUser);

app.use('/api/recipes', recipeRouter)

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  // routes(app);
});

export default app;