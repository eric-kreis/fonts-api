import dotenv from 'dotenv';
import express, { Handler, Router } from 'express';
import 'reflect-metadata';
import 'express-async-errors';
import FontController from '../controllers/font.controller';
import errorMiddleware from '../middlewares/error.middleware';
import FontService from '../services/font.service';
import { MetadataKeys } from '../utils/metadata.keys';
import { IRouter } from '../utils/handlers.decorator';

dotenv.config();

const app = express();
app.use(express.json());

[{ Controller: FontController, Service: FontService }].forEach(({ Controller, Service }) => {
  const info: Array<{ api: string, handler: string }> = [];
  const service = new Service();
  const controller: { [handlerName: string]: Handler } = new Controller(service) as any;
  const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, Controller);
  const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, Controller);
  const controllerRouter = Router();
  routers.forEach(({ method, path, handlerName }) => {
    controllerRouter[method](path, controller[String(handlerName)].bind(controller));
    info.push({
      api: `${method.toLocaleUpperCase()} ${basePath + path}`,
      handler: `${Controller.name}.${String(handlerName)}`,
    });
  });
  app.use(basePath, controllerRouter);
});

app.use(errorMiddleware);

export default app;
