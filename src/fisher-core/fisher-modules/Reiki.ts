import { makeAutoObservable } from 'mobx';
import invariant from 'invariant';
import {
  FisherSkill,
  IFisherPackagesData,
  FisherSkillRecipe,
} from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';

const logger = prefixLogger(prefixes.FISHER_CORE, 'Reiki');
/**
 * 灵气模块
 * 属于采集系统
 *
 * @export
 * @class Reiki
 */
export class Reiki {
  public id: string;
  public name: string;
  public skill: FisherSkill;
  public isActive: boolean = false;
  public packagesData: IFisherPackagesData = {
    items: [],
    recipes: [],
    recipePartMap: new Map(),
  };

  constructor() {
    makeAutoObservable(this);
    this.id = 'Reiki';
    this.name = '灵气';

    this.skill = new FisherSkill({
      id: this.id + ':Skill',
      name: this.name,
      experience: 0,
    });
  }

  public get activeRecipe() {
    return this.skill.activeRecipe;
  }

  public get levelInfo() {
    return this.skill.levelInfo;
  }

  public start = (value: FisherSkillRecipe) => {
    const recipe = this.packagesData.recipes.find(
      (item) => item.id === value.id
    );
    invariant(recipe !== undefined, 'Can not find selected recipe ' + value.id);

    this.skill.updateActiveRecipe(recipe);
    logger.info('Add selected recipe: ', recipe);

    this.skill.startAction();
    this.setIsActive(true);

    fisher.setActiveActionId(this.id);
  };

  public stop = () => {
    this.skill.stopAction();
    this.skill.resetActiveRecipe();
    this.setIsActive(false);
  };

  public setIsActive = (value: boolean) => {
    this.isActive = value;
  };
}
