import invariant from 'invariant';
import {
  FisherSkill,
  IFisherPackagesData,
  FisherRecipeItem,
} from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';
import { CollectionModule, CollectionTypes } from './CollectionModule';

const logger = prefixLogger(prefixes.FISHER_CORE, 'Reiki');
/**
 * 灵气模块
 * 属于采集系统
 *
 * @export
 * @class Reiki
 */
export class Reiki extends CollectionModule {
  public id = CollectionTypes.Reiki;
  public name = '灵气';
  public isActive = false;
  public skill = new FisherSkill({
    id: this.id + ':Skill',
    experience: 0,
  });
  public packagesData: IFisherPackagesData = {
    items: [],
    recipes: [],
    recipePartMap: new Map(),
  };

  public start = (value: FisherRecipeItem) => {
    const recipe = this.packagesData.recipes.find(
      (item) => item.id === value.id
    );
    invariant(recipe !== undefined, 'Can not find selected recipe ' + value.id);

    this.skill.updateActiveRecipe(recipe);
    logger.info('Add selected recipe: ', recipe);

    this.skill.startAction();
    this.isActive = true;

    fisher.setActiveActionId(this.id);
  };

  public stop = () => {
    this.skill.stopAction();
    this.skill.resetActiveRecipe();
    this.isActive = false;
  };
}
