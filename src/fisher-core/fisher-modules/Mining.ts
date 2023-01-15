import { EventKeys, events } from '../fisher-events';
import { ICollectionModuleData, store } from '../fisher-packages';
import { Recipe } from '../fisher-item';
import { Skill } from '../fisher-skill';
import { Collection } from './Collection';

class Mining extends Collection<ICollectionModuleData> {
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

  public start = (recipe: Recipe) => {
    this.skill.setActiveRecipe(recipe);
    this.skill.start();
    events.emit(EventKeys.Core.SetActiveComponent, this);
  };

  public stop = () => {
    this.skill.stop();
  };
}

const mining = Mining.create();

export { mining, Mining };
