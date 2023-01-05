import {
  IFisherMiningPackagesData,
  useModulePackage,
} from '../fisher-packages';
import { FisherCollectionSkillTypes } from '../fisher-skill';
import { CollectionModule } from './CollectionModule';

/**
 * 采矿模块
 *
 * @export
 * @class Mining
 * @extends {CollectionModule}
 */
export class Mining extends CollectionModule {
  override packages = useModulePackage('Mining') as IFisherMiningPackagesData;

  constructor() {
    super({ id: FisherCollectionSkillTypes.Mining });
  }
}
