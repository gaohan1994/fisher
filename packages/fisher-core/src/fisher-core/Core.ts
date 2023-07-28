import { IocService } from '@fisher/ioc';
import { ComponentId } from '@shared';

export class Core {
  private readonly ioc = new IocService();

  public get [ComponentId.Bank]() {
    return this.ioc.getService(ComponentId.Bank);
  }

  public getService = <T = any>(serviceId: ComponentId) => {
    return this.ioc.getService(serviceId) as T;
  };
}
