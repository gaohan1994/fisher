import { IFisherReikiPackagesData, useModulePackage } from '../fisher-packages';
import { FisherCollectionSkillTypes } from '../fisher-skill';
import { CollectionModule } from './CollectionModule';

/**
 * 灵气模块
 *
 * @export
 * @class Reiki
 * @extends {CollectionModule}
 */
export class Reiki extends CollectionModule {
  override packages = useModulePackage('Reiki') as IFisherReikiPackagesData;

  constructor() {
    super({ id: FisherCollectionSkillTypes.Reiki });
  }
}
