import { FisherCollectionSkillTypes } from '@FisherCore';
import { CollectionModule } from './CollectionModule';

/**
 * 采矿模块
 *
 * @export
 * @class Mining
 * @extends {CollectionModule}
 */
export class Mining extends CollectionModule {
  constructor() {
    super({ id: FisherCollectionSkillTypes.Mining });
  }
}
