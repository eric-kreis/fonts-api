import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import FontController from '../controllers/font.controller';
import errorMiddleware from '../middlewares/error.middleware';
import FontService from '../services/font.service';

dotenv.config();

const app = express();
app.use(express.json());

const fontService = new FontService();
const fontController = new FontController(fontService);

app.get('/fonts', fontController.findAll);

app.use(errorMiddleware);

export default app;
