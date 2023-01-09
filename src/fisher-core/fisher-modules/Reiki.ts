import { store } from '../fisher-packages';
import { Collection } from './Collection';

/**
 * 灵气模块
 *
 * @export
 * @class Reiki
 * @extends {CollectionModule}
 */
export class Reiki extends Collection {
  public static instance: Reiki;

  public static create(): Reiki {
    if (!Reiki.instance) {
      Reiki.instance = new Reiki();
    }
    return Reiki.instance;
  }

  public name = '打坐';

  public get packages() {
    return store.Reiki;
  }

  constructor() {
    super(Collection.CollectionModuleId.Reiki);
  }
}

export const reiki = Reiki.create();
