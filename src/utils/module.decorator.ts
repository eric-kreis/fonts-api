import { Handler, Router } from 'express';
import { IRouter } from './handlers.decorator';
import { MetadataKeys } from './metadata.keys';

interface IModuleOptions {
  controllers: any[];
  providers?: any[];
}

const Module = ({ controllers, providers }: IModuleOptions): ClassDecorator => (target) => {
  controllers.forEach((Controller) => {
    let controller: { [handlerName: string]: Handler } = new Controller();
    const controllerTypeParams = Reflect.getMetadata('design:paramtypes', Controller);
    if (controllerTypeParams) {
      const controllerDepencies = controllerTypeParams.map((type: string) => {
        const Provider = providers?.find((provider) => provider === type);
        if (!Provider) throw Error('Depedency not found in providers');
        return new Provider();
      });
      controller = new Controller(...controllerDepencies);
    }
    const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, Controller);
    const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, Controller);
    const controllerRouter = Router();
    routers.forEach(({ method, path, handlerName }) => {
      controllerRouter[method](path, controller[String(handlerName)].bind(controller));
      console.log({
        api: `${method.toLocaleUpperCase()} ${basePath + path}`,
        handler: `${Controller.name}.${String(handlerName)}`,
      });
    });

    Reflect.defineMetadata(MetadataKeys.BASE_PATH, basePath, target);
    Reflect.defineMetadata(MetadataKeys.ROUTER, controllerRouter, target);
  });
};

export default Module;
