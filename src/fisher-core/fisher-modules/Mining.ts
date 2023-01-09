import { core } from '../fisher-core';
import { Recipe } from '../fisher-item';
import { store } from '../fisher-packages';
import { Skill } from '../fisher-skill';

/**
 * 采矿模块
 *
 * @export
 * @class Mining
 */
export class Mining {
  public static instance: Mining;

  public static create(): Mining {
    if (!Mining.instance) {
      Mining.instance = new Mining();
    }
    return Mining.instance;
  }
  public id = 'Mining';

  public name = '采矿';

  public get packages() {
    return store.Mining;
  }

  public skill = new Skill(this.id);

  public get isActive() {
    return this.skill.timer.active;
  }

  public get activeRecipe() {
    return this.skill.activeRecipe;
  }

  public get levelInfo() {
    return this.skill.levelInfo;
  }

  public start = (recipe: Recipe) => {
    this.skill.setActiveRecipe(recipe);
    this.skill.start();
    core.setActiveComponent(this);
    Skill.logger.info(`start collection module ${this.id}`);
  };

  public stop = () => {
    this.skill.stop();
    Skill.logger.info(`stop collection module ${this.id}`);
  };
}

export const mining = Mining.create();
