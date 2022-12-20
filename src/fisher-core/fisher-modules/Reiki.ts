import { FisherCollectionSkillTypes } from '@FisherCore';
import { CollectionModule } from './CollectionModule';

/**
 * 灵气模块
 *
 * @export
 * @class Reiki
 * @extends {CollectionModule}
 */
export class Reiki extends CollectionModule {
  constructor() {
    super({ id: FisherCollectionSkillTypes.Reiki });
  }
}
