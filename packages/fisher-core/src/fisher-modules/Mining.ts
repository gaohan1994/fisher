import { EventKeys, events } from '@shared';
import { ICollectionModuleData, store } from '../fisher-packages';
import { Recipe } from '../fisher-item';
import { Skill } from '../fisher-skill';
import { Collection } from './Collection';
import { Assets } from '../assets';
import { ArchiveInterface } from '../fisher-archive';

class Mining extends Collection<ICollectionModuleData> {
  public static instance: Mining;

  public static create(): Mining {
    if (!Mining.instance) {
      Mining.instance = new Mining();
    }
    return Mining.instance;
  }

  public id = 'Mining';

  public name = '晶石';

  public media = Assets.mining;

  public skill = new Skill(this.id);

  public get packages() {
    return store.Mining;
  }

  private constructor() {
    super();
    events.on(EventKeys.Archive.LoadArchive, this.onLoadArchive);
  }

  public onLoadArchive = (value: ArchiveInterface.ArchiveValues) => {
    this.skill.experience.setExperience(value.mining?.experience ?? 0);
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

export { Mining };
