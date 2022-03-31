import express from 'express';
import 'reflect-metadata';
import 'express-async-errors';
import errorMiddleware from '../infra/middlewares/error.middleware';
import { MetadataKeys } from '../utils/metadata.keys';
import { FontModule } from '../infra/modules/font.module';

const app = express();
app.use(express.json());

[FontModule].forEach((Module) => {
  const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, Module);
  const router = Reflect.getMetadata(MetadataKeys.ROUTER, Module);
  app.use(basePath, router);
});

app.use(errorMiddleware);

export default app;
