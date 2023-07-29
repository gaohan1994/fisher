import { IocService } from '@fisher/ioc';
import { ComponentId } from '@shared';

export class Core {
  public readonly ioc = new IocService();

  constructor() {}

  public init = (): IocService => {
    this.ioc.init();
    return this.ioc;
  };

  public getService = <T = any>(serviceId: ComponentId) => {
    return this.ioc.getService(serviceId) as T;
  };
}
