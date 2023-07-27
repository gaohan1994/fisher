import 'reflect-metadata';
import { Graph } from './graph';

type DependenciesValue = Array<{
  id: string;
  parameterKey: string;
  parameterIndex: number;
}>;

type ServiceUniqueId = string | Symbol;

interface ServiceConstructor<T = any, R extends any[] = any[]> {
  new (...args: R): T;
}

export const serviceConstructorMap = new Map<ServiceUniqueId, ServiceConstructor>();

const IocServiceId = Symbol.for('IocServiceId');

const DependencyMetadataKey = Symbol.for('DependencyMetadataKey');

export class IocService {
  public readonly serviceStore = new Map<ServiceUniqueId, unknown>();

  constructor() {
    this.serviceStore.set(IocServiceId, this);
  }

  public init = () => {
    for (const serviceId of serviceConstructorMap.keys()) {
      this.getService(serviceId);
    }
  };

  public registerService = (id: ServiceUniqueId, service: unknown) => {
    this.serviceStore.set(id, service);
  };

  public getService = <T>(id: ServiceUniqueId): T => {
    if (this.serviceStore.has(id)) {
      return this.serviceStore.get(id)! as T;
    }

    return this.createAndCacheService<T>(id);
  };

  private createAndCacheService = <T>(serviceId: ServiceUniqueId): T => {
    const Constructor = this.getServiceConstructorById(serviceId);

    if (!Constructor) {
      throw new Error('error');
    }

    const graph = new Graph<{ serviceId: ServiceUniqueId; ctor: ServiceConstructor }>((node) =>
      node.serviceId.toString()
    );

    const stack = [{ ctor: Constructor, serviceId }];

    while (stack.length) {
      const node = stack.pop()!;
      graph.lookupOrInsertNode(node);

      const dependencies = (this.getServiceDependecies(Constructor) ?? []).sort(
        (a, b) => a.parameterIndex - b.parameterIndex
      );

      for (const { id: dependencyId } of dependencies) {
        if (this.serviceStore.has(dependencyId)) {
          continue;
        }

        const ServiceCtor = this.getServiceConstructorById(dependencyId);
        const dependencyNode = {
          ctor: ServiceCtor,
          serviceId: dependencyId,
        };

        if (!graph.lookup(dependencyNode)) {
          stack.push(dependencyNode);
        }

        graph.insertEdge(node, dependencyNode);
      }
    }

    while (true) {
      const roots = graph.roots();

      if (roots.length === 0) {
        if (!graph.isEmpty()) {
          throw new Error(`cycle`);
        }
        break;
      }

      for (const root of roots) {
        const { ctor: ServiceCtor, serviceId } = root.data;
        const dependencies = this.getServiceDependecies(ServiceCtor) || [];
        const args = dependencies.map(({ id }) => this.getService(id));
        const service = new ServiceCtor(...args);
        this.serviceStore.set(serviceId, service);
        graph.removeNode(root.data);
      }
    }

    return this.getService(serviceId);
  };

  private getServiceConstructorById = (id: ServiceUniqueId): ServiceConstructor => {
    if (!serviceConstructorMap.has(id)) {
      throw new Error(`Service ${id} not found!`);
    }

    return serviceConstructorMap.get(id)!;
  };

  private getServiceDependecies = (Constructor: ServiceConstructor): DependenciesValue => {
    return Reflect.getOwnMetadata(DependencyMetadataKey, Constructor);
  };
}

export function service(id?: string) {
  return (Constructor: ServiceConstructor, ...rest: any[]) => {
    const serviceId = id ?? Constructor.name.slice(0, 1).toUpperCase().concat(Constructor.name.slice(1));

    if (serviceConstructorMap.has(serviceId)) {
      throw new Error(`Service ${serviceId} already exist, do not register again!`);
    }

    serviceConstructorMap.set(serviceId, Constructor);
  };
}

export function inject(id: ServiceUniqueId) {
  return function injectedCtor(Constructor: ServiceConstructor, parameterKey: string, parameterIndex: number): any {
    if (Reflect.hasOwnMetadata(DependencyMetadataKey, Constructor)) {
      const dependencies = Reflect.getOwnMetadata(DependencyMetadataKey, Constructor);

      Reflect.defineMetadata(
        DependencyMetadataKey,
        [
          ...dependencies,
          {
            id,
            parameterKey,
            parameterIndex,
          },
        ],
        Constructor
      );
    } else {
      Reflect.defineMetadata(DependencyMetadataKey, [{ id, parameterKey, parameterIndex }], Constructor);
    }
  };
}
