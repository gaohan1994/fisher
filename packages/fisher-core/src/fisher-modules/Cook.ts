import { Assets } from '@assets';
import { ArchiveInterface } from '@archive';
import { EventKeys, events } from '@shared';
import { Recipe } from '@item';
import { store } from '../fisher-packages/index.js';
import { Skill } from '@skill';
import { Collection } from './Collection.js';

class Cook extends Collection<Recipe[]> {
  public static instance: Cook;

  public static create(): Cook {
    if (!Cook.instance) {
      Cook.instance = new Cook();
    }
    return Cook.instance;
  }

  public id = 'Cook';

  public name = '丹药';

  public media = Assets.cook;

  public skill = new Skill(this.id);

  public get activeRecipeAvailable() {
    return this.skill.recipeHandler.activeRecipeAvailable;
  }

  public get packages() {
    return store.Cook;
  }

  private constructor() {
    super();
    events.on(EventKeys.Archive.LoadArchive, this.onLoadArchive);
  }

  public onLoadArchive = (value: ArchiveInterface.ArchiveValues) => {
    this.skill.experience.setExperience(value.cook?.experience ?? 0);
  };

  public setActiveRecipe = (value: Recipe) => {
    this.skill.setActiveRecipe(value);
  };

  public start = () => {
    this.skill.start();
    events.emit(EventKeys.Core.SetActiveComponent, this);
  };

  public stop = () => {
    this.skill.stop();
  };
}

export { Cook };
