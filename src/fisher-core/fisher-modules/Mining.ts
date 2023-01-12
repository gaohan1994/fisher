import { EventKeys, events } from '../fisher-events';
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

  public skill = new Skill(this.id);

  public get packages() {
    return store.Mining;
  }

  public get isActive() {
    return this.skill.timer.active;
  }

  public get activeRecipe() {
    return this.skill.recipeHandler.activeRecipe;
  }

  public get levelInfo() {
    return this.skill.levelInfo;
  }

  public start = (recipe: Recipe) => {
    this.skill.setActiveRecipe(recipe);
    this.skill.start();
    events.emit(EventKeys.Core.SetActiveComponent, this);
  };

  public stop = () => {
    this.skill.stop();
  };
}

export const mining = Mining.create();
