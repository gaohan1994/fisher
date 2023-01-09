import { store } from '../fisher-packages';
import { Collection } from './Collection';

/**
 * 采矿模块
 *
 * @export
 * @class Mining
 * @extends {CollectionModule}
 */
export class Mining extends Collection {
  public static instance: Mining;

  public static create(): Mining {
    if (!Mining.instance) {
      Mining.instance = new Mining();
    }
    return Mining.instance;
  }

  public name = '采矿';

  public get packages() {
    return store.Mining;
  }

  constructor() {
    super(Collection.CollectionModuleId.Mining);
  }
}

export const mining = Mining.create();
