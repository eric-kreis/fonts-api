import express from 'express';
import FontController from '../controllers/font.controller';
import FontService from '../services/font.service';

const app = express();

app.use(express.json());

const fontService = new FontService();
const fontController = new FontController(fontService)

app.get('/:family', (req, res, next) => fontController.findAll(req, res, next))

export default app;
