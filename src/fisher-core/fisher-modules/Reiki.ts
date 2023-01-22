import { EventKeys, events } from '../fisher-events';
import { ICollectionModuleData, store } from '../fisher-packages';
import { Recipe } from '../fisher-item';
import { Skill } from '../fisher-skill';
import { Collection } from './Collection';
import { Assets } from '../assets';

class Reiki extends Collection<ICollectionModuleData> {
  public static instance: Reiki;

  public static create(): Reiki {
    if (!Reiki.instance) {
      Reiki.instance = new Reiki();
    }
    return Reiki.instance;
  }

  public id = 'Reiki';

  public name = '打坐';

  public media = Assets.reiki;

  public skill = new Skill(this.id);

  public get packages() {
    return store.Reiki;
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

const reiki = Reiki.create();

export { reiki, Reiki };
