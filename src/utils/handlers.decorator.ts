import { MetadataKeys } from './metadata.keys';
import { Methods } from './methods';

export interface IRouter {
  method: Methods;
  path: string;
  handlerName: string | symbol;
}

const methodDecoratorFactory = (method: Methods) => (
  (path: string = ''): MethodDecorator => (
    (target, propertyKey) => {
      const controllerClass = target.constructor;
      const routers: IRouter[] = (
        Reflect.hasMetadata(MetadataKeys.ROUTERS, controllerClass)
          ? Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass)
          : []
      );

      routers.push({
        method,
        path,
        handlerName: propertyKey,
      });

      Reflect.defineMetadata(MetadataKeys.ROUTERS, routers, controllerClass);
    }
  )
);

export const Get = methodDecoratorFactory(Methods.GET);
export const Post = methodDecoratorFactory(Methods.POST);
export const Put = methodDecoratorFactory(Methods.PUT);
export const Delete = methodDecoratorFactory(Methods.DELETE);
