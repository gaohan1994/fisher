import { EventKeys, events } from '../fisher-events';
import { ICollectionModuleData, store } from '../fisher-packages';
import { Recipe } from '../fisher-item';
import { Skill } from '../fisher-skill';
import { Collection } from './Collection';
import { Assets } from '../assets';
import { ArchiveInterface } from '../fisher-archive';

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

  private constructor() {
    super();
    events.on(EventKeys.Archive.LoadArchive, this.onLoadArchive);
  }

  public onLoadArchive = (value: ArchiveInterface.ArchiveValues) => {
    this.skill.experience.setExperience(value.reiki?.experience ?? 0);
  };

  public start = (recipe: Recipe) => {
    this.skill.setActiveRecipe(recipe);
    this.skill.start();
    events.emit(EventKeys.Core.SetActiveComponent, this);
  };

  public stop = () => {
    this.skill.stop();
  };
}

export { Reiki };
