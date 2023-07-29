import { inject, IocService } from '@fisher/ioc';
import { Backpack } from '@backpack';
import { ComponentId } from '@shared';
import { Bank } from '@bank';

export class Core {
  public readonly ioc = new IocService();

  constructor(
    @inject(ComponentId.Backpack) public readonly backpack: Backpack,
    @inject(ComponentId.Bank) public readonly bank: Bank
  ) {}

  public init = (): IocService => {
    this.ioc.init();
    return this.ioc;
  };

  public getService = <T = any>(serviceId: ComponentId) => {
    return this.ioc.getService(serviceId) as T;
  };
}
